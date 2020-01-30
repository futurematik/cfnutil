import { TemplateBuilder } from './TemplateBuilder';
import { addAsset } from './addAsset';
import { addParameter } from './addParameter';
import { ifChanged } from './ifChanged';

export interface AssetParams {
  S3Bucket: string;
  S3Key: string;
}

export function asset(
  key: string,
  description: string,
  generate: () => NodeJS.ReadableStream,
): [TemplateBuilder, AssetParams] {
  const bucketParamName = `asset${key}Bucket`;
  const keyParamName = `asset${key}Key`;

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
