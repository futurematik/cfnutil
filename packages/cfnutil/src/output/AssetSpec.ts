export interface AssetSpec {
  bucketParamName: string;
  keyParamName: string;
  generate(): NodeJS.ReadableStream;
}
