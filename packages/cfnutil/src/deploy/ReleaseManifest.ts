import { properties, text, dictionary } from '@fmtk/validation';

export interface AssetManifest {
  bucketParamName: string;
  file: string;
  keyParamName: string;
}

export interface ReleaseManifest {
  assets: { [key: string]: AssetManifest };
  template: string;
  version: string;
}

export const validateAssetManifest = properties<AssetManifest>({
  bucketParamName: text(),
  file: text(),
  keyParamName: text(),
});

export const validateReleaseManifest = properties<ReleaseManifest>({
  assets: dictionary(validateAssetManifest),
  template: text(),
  version: text(),
});
