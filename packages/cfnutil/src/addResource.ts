import { ResourceType } from '@fmtk/cfntypes';
import { ResourceSpec } from './ResourceSpec';
import { TemplateBuilder } from './TemplateBuilder';
import { TemplateSpec } from './TemplateSpec';
import { checkDuplicateResource } from './checkDuplicateResource';
import { checkName } from './checkName';

export function addResource<T extends ResourceType>(
  name: string,
  resource: ResourceSpec<T>,
  continueOnDuplicate = false,
): TemplateBuilder {
  return (template): TemplateSpec => {
    checkName(name);

    if (continueOnDuplicate && name in template.Resources) {
      return template;
    }

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
