import { ResourceType, AttributeTypeFor } from '@fmtk/cfntypes';
import { ResourceScope } from './ResourceScope';
import { TemplateBuilder } from '../builders/TemplateBuilder';
import { ResourceSpec } from '../output/ResourceSpec';
import { joinNames } from '../util/joinNames';
import { addResource } from '../builders/addResource';
import { makeResourceAttribs, WithRef } from './makeResourceAttribs';

export function singletonResource<T extends ResourceType>(
  scope: ResourceScope,
  uuid: string,
  resource: ResourceSpec<T>,
): [TemplateBuilder, AttributeTypeFor<T> & WithRef] {
  const name = `Singleton` + uuid;
  const fullName = joinNames((scope.root || scope).name, name);

  return [
    addResource(fullName, resource, /* continueOnDuplicate: */ true),
    makeResourceAttribs(resource.Type, fullName),
  ];
}
