import { joinNames } from '../util/joinNames';

export interface ResourceScopeBase {
  readonly name: string;
}

export interface RootResourceScope extends ResourceScopeBase {
  readonly root?: undefined;
}

export interface ChildResourceScope extends ResourceScopeBase {
  readonly root: ResourceScope;
}

export type ResourceScope = RootResourceScope | ChildResourceScope;

export function makeChildScope(
  parent: ResourceScope,
  name: string,
): ChildResourceScope {
  return {
    ...parent,
    name: joinNames(parent.name, name),
    root: parent.root || parent,
  };
}
