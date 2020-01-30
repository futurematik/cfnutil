import {
  ResourceScope,
  makeChildScope,
  ChildResourceScope,
} from './ResourceScope';
import { TemplateBuilder } from './TemplateBuilder';
import { composeBuilders } from './composeBuilders';

export interface ResourceGroup<Out> {
  (scope: ChildResourceScope): [TemplateBuilder[], Out];
}

export function resourceGroup<Out>(
  parent: ResourceScope,
  name: string,
  def: ResourceGroup<Out>,
): [TemplateBuilder, Out] {
  const scope = makeChildScope(parent, name);
  const [builders, out] = def(scope);

  return [composeBuilders(builders), out];
}
