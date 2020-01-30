import {
  ResourceScope,
  makeChildScope,
  ChildResourceScope,
} from './ResourceScope';
import { TemplateBuilder } from '../builders/TemplateBuilder';
import { composeBuilders } from '../builders/composeBuilders';

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
