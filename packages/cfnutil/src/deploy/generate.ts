import fs, { promises as pfs } from 'fs';
import path from 'path';
import { TemplateSpec } from '../output/TemplateSpec';
import { makeHashStream } from '../util/makeHashStream';
import { changeExt } from '../util/changeExt';
import { ReleaseManifest } from './ReleaseManifest';

export interface GenerateOptions {
  outputDir: string;
  templateVersion?: string;
}

export async function generate(
  spec: TemplateSpec,
  { outputDir, templateVersion }: GenerateOptions,
): Promise<ReleaseManifest> {
  const templateName = templateVersion
    ? `${templateVersion}.template.json`
    : `template.json`;

  const manifestName = templateVersion
    ? `${templateVersion}.manifest.json`
    : `manifest.json`;

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
  };

  for (const assetId in spec.Assets) {
    const asset = spec.Assets[assetId];
    const assetPath = path.join(outputDir, assetId);

    const outStream = asset
      .generate()
      .pipe(
        makeHashStream(hash => {
          manifest.assets[assetId] = changeExt(hash, path.extname(assetId));
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
          path.join(outputDir, manifest.assets[assetId]),
        );
      })(),
    );
  }

  await Promise.all(assetCompletions);

  await pfs.writeFile(
    path.join(outputDir, manifestName),
    JSON.stringify(manifest, null, 2),
    'utf8',
  );

  return manifest;
}
