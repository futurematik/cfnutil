import { properties, text, bool, optional } from '@fmtk/validation';

export interface CmdOptions {
  accessKeyId: string;
  bucketName: string;
  execute?: boolean;
  region: string;
  secretAccessKey: string;
  stage?: boolean;
  templateVersion: string;
}

export const validateCmdOptions = properties<CmdOptions>({
  accessKeyId: text(),
  bucketName: text(),
  execute: optional(bool()),
  region: text(),
  secretAccessKey: text(),
  stage: optional(bool()),
  templateVersion: text(),
});
