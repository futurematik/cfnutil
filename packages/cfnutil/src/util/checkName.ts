export function checkName(name: string): void {
  if (!/^[A-Za-z0-9]+/.test(name)) {
    throw new Error(`${name}: name must be alphanumeric`);
  }
}
