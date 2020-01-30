import {
  ResourceType,
  AttributeTypeFor,
  ResourceAttributes,
  AttributesFor,
} from '@fmtk/cfntypes';

export interface WithRef {
  readonly ref: string;
  readonly name: string;
}

export function makeResourceAttribs<T extends ResourceType>(
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
      name: resourceName,
    } as AttributeTypeFor<T> & WithRef,
  );
}
