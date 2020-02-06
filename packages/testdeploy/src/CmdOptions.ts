import { properties, text } from '@fmtk/validation';

export interface CmdOptions {
  accessKeyId: string;
  bucketName: string;
  region: string;
  secretAccessKey: string;
  templateVersion: string;
}

export const validateCmdOptions = properties<CmdOptions>({
  accessKeyId: text(),
  bucketName: text(),
  region: text(),
  secretAccessKey: text(),
  templateVersion: text(),
});
