import fs, { promises as pfs } from 'fs';
import path from 'path';
import { S3 } from 'aws-sdk';
import { validateReleaseManifest, ReleaseManifest } from './ReleaseManifest';
import { AwsConfig } from './AwsConfig';
import { assertValid, ValidationMode } from '@fmtk/validation';

export interface StagingOptions {
  manifestPath: string;
  bucketName: string;
}

export async function stageRemote(
  config: AwsConfig,
  { manifestPath, bucketName }: StagingOptions,
): Promise<void> {
  const manifestDir = path.resolve(path.dirname(manifestPath));
  let manifest: ReleaseManifest;

  try {
    const manifestFile = await pfs.readFile(manifestPath, 'utf-8');

    manifest = assertValid(JSON.parse(manifestFile), validateReleaseManifest, {
      mode: ValidationMode.JSON,
    });
  } catch (e) {
    throw new Error(`error parsing manifest file: ${e}`);
  }

  const s3 = new S3(config);

  await Promise.all([
    upload(s3, bucketName, path.basename(manifestPath), manifestDir),
    upload(s3, bucketName, manifest.template, manifestDir),
    ...Object.keys(manifest.assets).map(x =>
      upload(s3, bucketName, manifest.assets[x].file, manifestDir),
    ),
  ]);
}

async function upload(
  s3: S3,
  bucket: string,
  fileName: string,
  basePath: string,
): Promise<void> {
  await s3
    .upload({
      Bucket: bucket,
      Key: path.basename(fileName),
      Body: fs.createReadStream(path.resolve(basePath, fileName)),
    })
    .promise();
}
