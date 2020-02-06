import { TemplateBuilder } from './TemplateBuilder';
import { TemplateSpec } from '../output/TemplateSpec';
import { AssetSpec } from '../output/AssetSpec';

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
