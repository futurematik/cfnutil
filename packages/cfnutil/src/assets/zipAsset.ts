import crypto from 'crypto';
import path from 'path';
import yazl from 'yazl';
import { TemplateBuilder } from '../builders/TemplateBuilder';
import { AssetAttributes, asset } from './asset';

export interface ZipAssetEntry {
  source: string;
  target: string;
}

export function zipAsset(
  description: string,
  files: ZipAssetEntry[],
  key?: string,
): [TemplateBuilder, AssetAttributes] {
  if (!key) {
    const hash = crypto.createHash('sha1');

    for (const file of files) {
      hash.update(path.resolve(file.source));
      hash.update(file.target);
    }

    key = hash.digest('hex');
  }

  return asset(
    { key: `${key}.zip`, description },
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
