import { ResourceType } from '@fmtk/cfntypes';
import { ResourceSpec } from './ResourceSpec';
import { TemplateBuilder } from './TemplateBuilder';
import { TemplateSpec } from './TemplateSpec';
import { checkDuplicateResource } from './checkDuplicateResource';

export function addResource<T extends ResourceType>(
  name: string,
  resource: ResourceSpec<T>,
): TemplateBuilder {
  return (template): TemplateSpec => {
    checkDuplicateResource(template, name);
    return {
      ...template,
      Resources: {
        ...template.Resources,
        [name]: resource,
      },
    };
  };
}
