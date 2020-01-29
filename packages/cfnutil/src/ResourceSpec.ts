import { ResourceTypes, ResourceType } from '@fmtk/cfntypes';

export interface ResourceSpec<T extends ResourceType = ResourceType> {
  Type: T;
  Properties: ResourceTypes[T];
  DependsOn?: string[];
}
