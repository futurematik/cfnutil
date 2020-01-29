import { TemplateBuilder } from './TemplateBuilder';
import { TemplateSpec } from './TemplateSpec';
import { AssetSpec } from './AssetSpec';

export function addAsset(name: string, asset: AssetSpec): TemplateBuilder {
  return (template): TemplateSpec => {
    // don't add a duplicate asset
    if (name in template.Assets) {
      return template;
    }
    return {
      ...template,
      Assets: {
        ...template.Assets,
        [name]: asset,
      },
    };
  };
}
