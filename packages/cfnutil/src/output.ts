import { ResourceScope } from './ResourceScope';
import { TemplateBuilder } from './TemplateBuilder';
import { addOutput } from './addOutput';
import { joinNames } from './joinNames';
import { OutputSpec } from './OutputSpec';

export function output<T>(
  scope: ResourceScope,
  name: string,
  spec: OutputSpec<T>,
): TemplateBuilder {
  return addOutput(joinNames(scope.name, name), spec);
}
