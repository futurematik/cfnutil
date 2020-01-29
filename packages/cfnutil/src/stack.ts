import { ResourceScope } from './ResourceScope';
import { TemplateBuilder } from './TemplateBuilder';
import { TemplateSpec } from './TemplateSpec';

export function stack(
  name: string,
  def: (scope: ResourceScope) => TemplateBuilder[],
): TemplateSpec {
  const builders = def({ name });

  return builders.reduce((a, x) => x(a), {
    Assets: {},
    Outputs: {},
    Parameters: {},
    Resources: {},
  });
}
