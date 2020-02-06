import path from 'path';
import {
  stack,
  resource,
  zipAsset,
  TemplateSpec,
  resourceGroup,
  ResourceScope,
  awsStr,
  AwsParams,
  generate,
  stageRemote,
  deployRelease,
  ReleaseCapabilities,
} from '@fmtk/cfnutil';
import {
  ResourceType,
  IAMRoleProps,
  LambdaFunctionProps,
  ApiGatewayMethodProps,
} from '@fmtk/cfntypes';
import { run } from './run';
import rc from 'rc';
import minimist from 'minimist';
import { assertValid, ValidationMode } from '@fmtk/validation';
import { validateCmdOptions } from './CmdOptions';

run(async function main(args: string[]): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _, config, configs, ...parsed } = rc(
    'testdeploy',
    {},
    minimist(args),
  );
  const opts = assertValid(parsed, validateCmdOptions, {
    mode: ValidationMode.JSON,
  });
  const template = myStack();

  const release = await generate(template, {
    outputDir: path.resolve(__dirname, '../dist'),
    templateVersion: opts.templateVersion,
  });

  await stageRemote(opts, release.manifestPath, opts.bucketName);

  if (opts.stage) {
    console.log(`not releasing (because --stage was specified)`);
  } else {
    const result = await deployRelease(opts, {
      bucketName: opts.bucketName,
      capabilities: ReleaseCapabilities.NamedIam,
      execute: opts.execute,
      manifestKey: path.basename(release.manifestPath),
      stackName: 'MyTestStack',
    });

    console.log(`released`, result);
  }
});

function myStack(): TemplateSpec {
  return stack('MyStack', scope => {
    const [handler, handlerAttribs] = handlerGroup(scope, 'My Handler');

    const [restApi, restApiAttribs] = resource(scope, 'RestApi', {
      Type: ResourceType.ApiGatewayRestApi,
      Properties: {},
    });

    const [apiMethod] = resource(scope, 'ApiMethod', {
      Type: ResourceType.ApiGatewayMethod,
      Properties: as<ApiGatewayMethodProps>({
        HttpMethod: 'GET',
        RestApiId: restApiAttribs.ref,
        ResourceId: restApiAttribs.RootResourceId,
        Integration: {
          IntegrationHttpMethod: 'POST',
          Type: 'AWS_PROXY',
          Uri: awsStr`arn:${AwsParams.Partition}:apigateway:eu-west-2:lambda:path/2015-03-31/functions/${handlerAttribs.lambdaArn}/invocations`,
        },
      }),
    });

    return [handler, restApi, apiMethod];
  });
}

function handlerGroup(scope: ResourceScope, name: string) {
  return resourceGroup(scope, name, scope => {
    const [role, roleAttribs] = resource(scope, 'HandlerRole', {
      Type: ResourceType.IAMRole,
      Properties: as<IAMRoleProps>({
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                Service: 'lambda.amazonaws.com',
              },
            },
          ],
          Version: '2012-10-17',
        },
        ManagedPolicyArns: [
          'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
        ],
      }),
    });

    const [handlerAsset, handlerCode] = zipAsset('HandlerCode', [
      {
        source: path.resolve(__dirname, '../lib/lambda.js'),
        target: 'index.js',
      },
    ]);

    const [handler, handlerAttribs] = resource(scope, 'HandlerFunc', {
      Type: ResourceType.LambdaFunction,
      Properties: as<LambdaFunctionProps>({
        Code: handlerCode,
        Handler: 'index.handler',
        Role: roleAttribs.Arn,
        Runtime: 'runtime',
      }),
    });

    return [
      [role, handlerAsset, handler],
      {
        lambdaArn: handlerAttribs.Arn,
      },
    ];
  });
}

// type helper for use until microsoft/TypeScript#35702 is fixed
function as<T>(value: T): T {
  return value;
}
