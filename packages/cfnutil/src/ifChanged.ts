import { TemplateBuilder } from './TemplateBuilder';
import { composeBuilders } from './composeBuilders';
import { TemplateSpec } from './TemplateSpec';

export function ifChanged(
  primary: TemplateBuilder | TemplateBuilder[],
  onChanged: TemplateBuilder | TemplateBuilder[],
  onNotChanged?: TemplateBuilder | TemplateBuilder[],
): TemplateBuilder {
  const primaryComposed = composeBuilders(primary);
  const onChangedComposed = composeBuilders(onChanged);
  const onNotChangedComposed = onNotChanged && composeBuilders(onNotChanged);

  return (template): TemplateSpec => {
    const next = primaryComposed(template);

    if (template !== next) {
      return onChangedComposed(next);
    } else if (onNotChangedComposed) {
      return onNotChangedComposed(next);
    } else {
      return next;
    }
  };
}
