import { ResourceScope } from './ResourceScope';
import { TemplateBuilder } from '../builders/TemplateBuilder';
import { addOutput } from '../builders/addOutput';
import { joinNames } from '../util/joinNames';
import { OutputSpec } from '../output/OutputSpec';

export function output<T>(
  scope: ResourceScope,
  name: string,
  spec: OutputSpec<T>,
): TemplateBuilder {
  return addOutput(joinNames(scope.name, name), spec);
}
