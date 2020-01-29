import { TemplateBuilder } from './TemplateBuilder';
import { addAsset } from './addAsset';
import { addParameter } from './addParameter';
import { TemplateSpec } from './TemplateSpec';

export interface AssetParams {
  S3Bucket: string;
  S3Key: string;
}

export function asset(
  key: string,
  generate: () => NodeJS.ReadableStream,
): [TemplateBuilder, AssetParams] {
  const bucketParamName = `asset${key}Bucket`;
  const keyParamName = `asset${key}Key`;

  const asset = addAsset(key, { generate });
  const bucketParam = addParameter(bucketParamName, { Type: 'String' });
  const keyParam = addParameter(keyParamName, { Type: 'String' });

  return [
    (template): TemplateSpec => {
      const next = asset(template);
      if (next === template) {
        // don't add the params if the asset already exists
        return next;
      }
      return bucketParam(keyParam(template));
    },
    {
      // type for output type
      S3Bucket: ({ Ref: bucketParamName } as unknown) as string,
      S3Key: ({ Ref: keyParamName } as unknown) as string,
    },
  ];
}
