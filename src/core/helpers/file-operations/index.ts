// src/utils/write-json-to-file.ts
import { Logger } from '@nestjs/common';
import * as fs from 'fs';

const logger = new Logger();

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
