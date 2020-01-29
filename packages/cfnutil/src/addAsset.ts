import { TemplateBuilder } from './TemplateBuilder';
import { TemplateSpec } from './TemplateSpec';
import { AssetSpec } from './AssetSpec';
import { checkName } from './checkName';

export function addAsset(name: string, asset: AssetSpec): TemplateBuilder {
  return (template): TemplateSpec => {
    checkName(name);

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
