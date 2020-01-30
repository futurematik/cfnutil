import { ResourceType, AttributeTypeFor } from '@fmtk/cfntypes';
import { ResourceScope } from './ResourceScope';
import { TemplateBuilder } from './TemplateBuilder';
import { ResourceSpec } from './ResourceSpec';
import { joinNames } from './joinNames';
import { addResource } from './addResource';
import { makeResourceAttribs, WithRef } from './makeResourceAttribs';

export function resource<T extends ResourceType>(
  scope: ResourceScope,
  name: string,
  resource: ResourceSpec<T>,
): [TemplateBuilder, AttributeTypeFor<T> & WithRef] {
  const fullName = joinNames(scope.name, name);

  return [
    addResource(fullName, resource),
    makeResourceAttribs(resource.Type, fullName),
  ];
}
