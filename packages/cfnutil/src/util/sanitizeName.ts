import { hash } from './hash';

export function sanitizeName(name: string): string {
  const clean = name.replace(/[^A-Za-z0-9]/i, '');

  if (clean !== name) {
    return clean + hash(name).substr(0, 7);
  }

  return name;
}
