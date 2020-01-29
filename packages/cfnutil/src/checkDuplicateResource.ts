import { TemplateSpec } from './TemplateSpec';

export function checkDuplicateResource(
  template: TemplateSpec,
  name: string,
): void {
  if (name in template.Resources) {
    throw new Error(`template already contains a resource '${name}'`);
  }
  if (name in template.Parameters) {
    throw new Error(`template already contains a parameter '${name}'`);
  }
}
