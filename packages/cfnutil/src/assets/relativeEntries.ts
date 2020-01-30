import path from 'path';
import { ZipAssetEntry } from './zipAsset';

export function relativeEntries(
  basePath: string,
  files: string[],
): ZipAssetEntry[] {
  basePath = path.resolve(basePath);

  if (!basePath.endsWith('/')) {
    basePath += '/';
  }

  const entries: ZipAssetEntry[] = [];

  for (const file of files) {
    const absFile = path.resolve(file);
    if (!absFile.startsWith(basePath)) {
      throw new Error(`the file ${absFile} is not within ${basePath}`);
    }
    entries.push({ source: absFile, target: absFile.substr(basePath.length) });
  }

  return entries;
}
