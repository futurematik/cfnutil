import { OutputSpec } from '../output/OutputSpec';
import { TemplateBuilder } from './TemplateBuilder';
import { TemplateSpec } from '../output/TemplateSpec';
import { checkName } from '../util/checkName';

export function addOutput<T>(
  name: string,
  output: OutputSpec<T>,
): TemplateBuilder {
  return (template): TemplateSpec => {
    checkName(name);

    if (name in template.Outputs) {
      throw new Error(`template already contains an output '${name}'`);
    }
    return {
      ...template,
      Outputs: {
        ...template.Outputs,
        [name]: output,
      },
    };
  };
}
