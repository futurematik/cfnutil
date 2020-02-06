export function flatten<T>(items: (T | T[])[]): T[] {
  return ([] as T[]).concat(...items);
}
