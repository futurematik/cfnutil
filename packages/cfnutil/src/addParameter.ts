import { ParameterSpec } from './ParameterSpec';
import { TemplateBuilder } from './TemplateBuilder';
import { TemplateSpec } from './TemplateSpec';
import { checkDuplicateResource } from './checkDuplicateResource';

export function addParameter(
  name: string,
  parameter: ParameterSpec,
): TemplateBuilder {
  return (template): TemplateSpec => {
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
