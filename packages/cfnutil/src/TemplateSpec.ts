import { ResourceSpec } from './ResourceSpec';
import { OutputSpec } from './OutputSpec';
import { AssetSpec } from './AssetSpec';
import { ParameterSpec } from './ParameterSpec';

export interface TemplateSpec {
  Assets: { [name: string]: AssetSpec };
  Outputs: { [name: string]: OutputSpec };
  Parameters: { [name: string]: ParameterSpec };
  Resources: { [name: string]: ResourceSpec };
}
