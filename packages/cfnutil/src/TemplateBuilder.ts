import { TemplateSpec } from './TemplateSpec';

export interface TemplateBuilder {
  (template: TemplateSpec): TemplateSpec;
}
