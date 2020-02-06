import { S3, CloudFormation } from 'aws-sdk';
import { AwsConfig } from './AwsConfig';
import { assertValid, ValidationMode } from '@fmtk/validation';
import { validateReleaseManifest } from './ReleaseManifest';
import { Parameter } from 'aws-sdk/clients/cloudformation';

export enum ReleaseCapabilities {
  Iam = 'CAPABILITY_IAM',
  NamedIam = 'CAPABILITY_NAMED_IAM',
}

export interface ReleaseInfo {
  bucketName: string;
  capabilities?: ReleaseCapabilities;
  execute?: boolean;
  manifestKey: string;
  params?: { [key: string]: string };
  stackName: string;
}

export interface StackInfo {
  stackId: string;
  changeSetId: string;
}

export async function deployRelease(
  config: AwsConfig,
  {
    bucketName,
    capabilities,
    execute,
    manifestKey,
    params = {},
    stackName,
  }: ReleaseInfo,
): Promise<StackInfo> {
  const s3 = new S3(config);

  const manifestStream = s3
    .getObject({ Bucket: bucketName, Key: manifestKey })
    .createReadStream();

  const chunks: Buffer[] = [];

  for await (const chunk of manifestStream) {
    chunks.push(chunk);
  }

  const manifestFile = Buffer.concat(chunks).toString('utf-8');

  const manifest = assertValid(
    JSON.parse(manifestFile),
    validateReleaseManifest,
    { mode: ValidationMode.JSON },
  );

  for (const key in manifest.assets) {
    const asset = manifest.assets[key];
    params[asset.bucketParamName] = bucketName;
    params[asset.keyParamName] = asset.file;
  }

  const cf = new CloudFormation(config);
  const stacks = await cf.listStacks({}).promise();

  const exists = !!(
    stacks.StackSummaries &&
    stacks.StackSummaries.find(
      x => x.StackName === stackName && x.StackStatus !== 'REVIEW_IN_PROGRESS',
    )
  );

  const parameters = Object.keys(params).reduce(
    (a, x) => [...a, { ParameterKey: x, ParameterValue: params[x] }],
    [] as Parameter[],
  );

  const changeSetName = `${stackName}-${manifest.version}`;

  const result = await cf
    .createChangeSet({
      StackName: stackName,
      ChangeSetType: exists ? 'UPDATE' : 'CREATE',
      ChangeSetName: changeSetName,
      TemplateURL: `https://s3.amazonaws.com/${bucketName}/${manifest.template}`,
      Parameters: parameters,
      Capabilities: capabilities ? [capabilities] : [],
    })
    .promise();

  if (execute) {
    await cf
      .executeChangeSet({
        StackName: stackName,
        ChangeSetName: changeSetName,
      })
      .promise();
  }

  return {
    stackId: result.StackId as string,
    changeSetId: result.Id as string,
  };
}
