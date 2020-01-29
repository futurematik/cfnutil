import { ParameterSpec } from './ParameterSpec';
import { TemplateBuilder } from './TemplateBuilder';
import { TemplateSpec } from './TemplateSpec';
import { checkDuplicateResource } from './checkDuplicateResource';
import { checkName } from './checkName';

export function addParameter(
  name: string,
  parameter: ParameterSpec,
): TemplateBuilder {
  return (template): TemplateSpec => {
    checkName(name);
    checkDuplicateResource(template, name);

    return {
      ...template,
      Parameters: {
        ...template.Parameters,
        [name]: parameter,
      },
    };
  };
}
