// src/utils/write-json-to-file.ts
import { Logger } from '@nestjs/common';
import * as fs from 'fs';

const logger = new Logger();
const ONE_KB = 1024;
const ONE_MB = ONE_KB * ONE_KB;
const ONE_GB = ONE_MB * ONE_KB;

export const writeJsonToFile = (data: any) => {
  const filePath = 'vault-oas.json'; // Path to the file in the project root

  try {
    const jsonString = JSON.stringify(data, null, 2); // Pretty-print JSON
    fs.writeFileSync(filePath, jsonString);
    logger.verbose(`Swagger's OAS file generated ${filePath}`);
  } catch (error) {
    logger.error(`Error Swagger's OAS file: ${error}`);
  }
};

export const printMigrationErrorLogs = (log: Logger, table: string, message: string): void => {
  if (message?.trim()?.toString()?.endsWith('already exists')) log.warn(message);
  else log.error(`Up: Create ${table} has an error: `, message);
};

export const convertBytesToHumanReadable = (bytes: number): string => {
  if (bytes < ONE_KB) {
    return `${bytes} B`;
  } else if (bytes < ONE_MB) {
    return `${(bytes / ONE_KB).toFixed(2)} KB`;
  } else if (bytes < ONE_GB) {
    return `${(bytes / ONE_MB).toFixed(2)} MB`;
  } else {
    return `${(bytes / ONE_GB).toFixed(2)} GB`;
  }
};
