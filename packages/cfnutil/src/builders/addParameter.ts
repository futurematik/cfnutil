import { ParameterSpec } from '../output/ParameterSpec';
import { TemplateBuilder } from './TemplateBuilder';
import { TemplateSpec } from '../output/TemplateSpec';
import { checkDuplicateResource } from '../util/checkDuplicateResource';
import { checkName } from '../util/checkName';

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
