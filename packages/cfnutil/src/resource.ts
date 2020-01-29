import {
  ResourceType,
  AttributeTypeFor,
  ResourceAttributes,
  AttributesFor,
} from '@fmtk/cfntypes';
import { ResourceScope } from './ResourceScope';
import { TemplateBuilder } from './TemplateBuilder';
import { ResourceSpec } from './ResourceSpec';
import { joinNames } from './joinNames';
import { addResource } from './addResource';

export interface WithRef {
  readonly ref: string;
}

export function resource<T extends ResourceType>(
  scope: ResourceScope,
  name: string,
  resource: ResourceSpec<T>,
): [TemplateBuilder, AttributeTypeFor<T> & WithRef] {
  const fullName = joinNames(scope.name, name);

  return [
    addResource(fullName, resource),
    makeAttribsOutput(resource.Type, fullName),
  ];
}

export function makeAttribsOutput<T extends ResourceType>(
  resource: T,
  resourceName: string,
): AttributeTypeFor<T> & WithRef {
  return (ResourceAttributes[resource] as AttributesFor<T>[]).reduce(
    (out, attrib) => ({
      ...out,
      [attrib]: { 'Fn::GetAtt': [resourceName, attrib] },
    }),
    {
      ref: ({ Ref: resourceName } as unknown) as string, // type for output
    } as AttributeTypeFor<T> & WithRef,
  );
}
