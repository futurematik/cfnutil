import { TemplateBuilder } from '../builders/TemplateBuilder';
import { addAsset } from '../builders/addAsset';
import { addParameter } from '../builders/addParameter';
import { ifChanged } from '../builders/ifChanged';
import { sanitizeName } from '../util/sanitizeName';

export interface AssetParams {
  description?: string;
  key: string;
}

export interface AssetAttributes {
  S3Bucket: string;
  S3Key: string;
}

export function asset(
  { description, key }: AssetParams,
  generate: () => NodeJS.ReadableStream,
): [TemplateBuilder, AssetAttributes] {
  const cleanKey = sanitizeName(key);
  const bucketParamName = `asset${cleanKey}Bucket`;
  const keyParamName = `asset${cleanKey}Key`;

  const asset = addAsset(key, { generate });

  const bucketParam = addParameter(bucketParamName, {
    Type: 'String',
    Description: `Bucket for asset: ${description}`,
  });

  const keyParam = addParameter(keyParamName, {
    Type: 'String',
    Description: `Object key for asset: ${description}`,
  });

  return [
    ifChanged(asset, [bucketParam, keyParam]),
    {
      // type for output type
      S3Bucket: ({ Ref: bucketParamName } as unknown) as string,
      S3Key: ({ Ref: keyParamName } as unknown) as string,
    },
  ];
}
