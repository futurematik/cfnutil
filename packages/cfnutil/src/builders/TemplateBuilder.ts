import { TemplateSpec } from '../output/TemplateSpec';

export interface TemplateBuilder {
  (template: TemplateSpec): TemplateSpec;
}
