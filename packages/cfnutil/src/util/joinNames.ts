import { sanitizeName } from './sanitizeName';

export function joinNames(...names: string[]): string {
  return sanitizeName(names.join(''));
}
