import 'jest';
import path from 'path';
import { relativeEntries } from './relativeEntries';

describe('relativeEntries', () => {
  it('creates entries relative to a base path', () => {
    const result = relativeEntries('.', ['one.txt', 'foo/two.txt']);

    expect(result).toEqual([
      { source: path.join(process.cwd(), 'one.txt'), target: 'one.txt' },
      {
        source: path.join(process.cwd(), 'foo/two.txt'),
        target: 'foo/two.txt',
      },
    ]);
  });

  it('rejects paths not within the base', () => {
    expect(() => relativeEntries('/base/path', ['/other/one.txt'])).toThrow();
  });
});
