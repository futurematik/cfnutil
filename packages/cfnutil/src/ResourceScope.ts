import { joinNames } from './joinNames';

export interface ResourceScope {
  readonly name: string;
}

export function makeChildScope(
  parent: ResourceScope,
  name: string,
): ResourceScope {
  return {
    ...parent,
    name: joinNames(parent.name, name),
  };
}
