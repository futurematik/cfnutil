import { TemplateBuilder } from './TemplateBuilder';
import { TemplateSpec } from '../output/TemplateSpec';
import { flatten } from '../util/flatten';

export function composeBuilders(
  ...builders: (TemplateBuilder | TemplateBuilder[])[]
): TemplateBuilder {
  const flatBuilders = flatten(builders);

  if (flatBuilders.length === 0) {
    return (t): TemplateSpec => t;
  }
  if (flatBuilders.length === 1) {
    return flatBuilders[0];
  }

  return (template): TemplateSpec =>
    flatBuilders.reduce((b, x) => x(b), template);
}
