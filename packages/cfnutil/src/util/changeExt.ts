import path from 'path';

export function changeExt(name: string, ext: string): string {
  if (!ext.startsWith('.') && ext) {
    ext = '.' + ext;
  }
  const basename = path.basename(name, path.extname(name)) + ext;
  return path.join(path.dirname(name), basename);
}
