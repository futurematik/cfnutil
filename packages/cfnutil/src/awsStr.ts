/* eslint-disable @typescript-eslint/no-explicit-any */

export function awsStr(
  parts: TemplateStringsArray,
  ...interpolations: any[]
): string {
  const joined: any[] = [];

  for (let i = 0; i < parts.length; ++i) {
    joined.push(parts[i]);

    if (i < interpolations.length) {
      joined.push(interpolations[i]);
    }
  }

  return ({
    'Fn::Join': ['', joined],
  } as unknown) as string; // type for output
}
