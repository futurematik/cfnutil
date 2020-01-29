import { OutputSpec } from './OutputSpec';
import { TemplateBuilder } from './TemplateBuilder';
import { TemplateSpec } from './TemplateSpec';

export function addOutput<T>(
  name: string,
  output: OutputSpec<T>,
): TemplateBuilder {
  return (template): TemplateSpec => {
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
