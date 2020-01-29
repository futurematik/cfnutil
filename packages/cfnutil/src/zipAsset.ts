import crypto from 'crypto';
import path from 'path';
import yazl from 'yazl';
import { TemplateBuilder } from './TemplateBuilder';
import { AssetParams, asset } from './asset';

export interface ZipAssetEntry {
  source: string;
  target: string;
}

export function zipAsset(
  files: ZipAssetEntry[],
  key?: string,
): [TemplateBuilder, AssetParams] {
  if (!key) {
    const hash = crypto.createHash('sha256');

    for (const file of files) {
      hash.update(path.resolve(file.source));
      hash.update(file.target);
    }

    key = hash.digest('hex');
  }

  return asset(
    key,
    (): NodeJS.ReadableStream => {
      const zip = new yazl.ZipFile();

      for (const file of files) {
        zip.addFile(file.source, file.target);
      }

      zip.end();
      return zip.outputStream;
    },
  );
}
