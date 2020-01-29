import { ResourceScope, makeChildScope } from './ResourceScope';
import { TemplateBuilder } from './TemplateBuilder';
import { TemplateSpec } from './TemplateSpec';

export interface ResourceGroup<Out> {
  (scope: ResourceScope): [TemplateBuilder[], Out];
}

export function resourceGroup<Out>(
  parent: ResourceScope,
  name: string,
  def: ResourceGroup<Out>,
): [TemplateBuilder, Out] {
  const scope = makeChildScope(parent, name);
  const [builders, out] = def(scope);

  return [
    (template): TemplateSpec => builders.reduce((a, x) => x(a), template),
    out,
  ];
}
