export interface OutputSpec<T = unknown> {
  Description?: string;
  Value: T;
  Export?: { Name: string };
}
