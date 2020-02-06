import fs, { promises as pfs } from 'fs';
import path from 'path';
import { TemplateSpec } from '../output/TemplateSpec';
import { makeHashStream } from '../util/makeHashStream';
import { changeExt } from '../util/changeExt';
import { ReleaseManifest } from './ReleaseManifest';

export interface GenerateOptions {
  outputDir: string;
  templateVersion: string;
}

export interface GeneratedRelease {
  manifestPath: string;
  manifest: ReleaseManifest;
}

export async function generate(
  spec: TemplateSpec,
  { outputDir, templateVersion }: GenerateOptions,
): Promise<GeneratedRelease> {
  const templateName = `${templateVersion}.template.json`;
  const manifestName = `${templateVersion}.manifest.json`;

  outputDir = path.resolve(outputDir);
  await pfs.mkdir(outputDir, { recursive: true });

  const template = {
    Parameters: spec.Parameters,
    Resources: spec.Resources,
    Outputs: spec.Outputs,
  };

  await pfs.writeFile(
    path.join(outputDir, templateName),
    JSON.stringify(template, null, 2),
    'utf8',
  );

  const assetCompletions: Promise<void>[] = [];

  const manifest: ReleaseManifest = {
    template: templateName,
    assets: {},
    version: templateVersion,
  };

  for (const assetId in spec.Assets) {
    const asset = spec.Assets[assetId];
    const assetPath = path.join(outputDir, assetId);

    const outStream = asset
      .generate()
      .pipe(
        makeHashStream(hash => {
          manifest.assets[assetId] = {
            file: changeExt(hash, path.extname(assetId)),
            bucketParamName: asset.bucketParamName,
            keyParamName: asset.keyParamName,
          };
        }),
      )
      .pipe(fs.createWriteStream(assetPath, 'utf8'));

    assetCompletions.push(
      (async (): Promise<void> => {
        await new Promise((resolve, reject) => {
          outStream.on('error', err => {
            reject(err);
          });
          outStream.on('finish', () => {
            resolve();
          });
        });

        await pfs.rename(
          assetPath,
          path.join(outputDir, manifest.assets[assetId].file),
        );
      })(),
    );
  }

  await Promise.all(assetCompletions);
  const manifestPath = path.join(outputDir, manifestName);
  await pfs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  return { manifestPath, manifest };
}
