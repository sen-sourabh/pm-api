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
