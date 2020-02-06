import crypto from 'crypto';
import { flatten } from './flatten';

export function hash(...items: (string | string[])[]): string {
  return flatten(items)
    .reduce((sha, x) => sha.update(x), crypto.createHash('sha1'))
    .digest('hex');
}
