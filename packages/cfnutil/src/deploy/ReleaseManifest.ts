import { properties, text, dictionary } from '@fmtk/validation';

export interface ReleaseManifest {
  template: string;
  assets: { [key: string]: string };
}

export const validateReleaseManifest = properties<ReleaseManifest>({
  template: text(),
  assets: dictionary(text()),
});
