import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

const configService = new ConfigService();
const key = configService?.getOrThrow<string>('ENCRYPTION_KEY');

// Generate a random 6-digit number
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateSecretKey = (): string => {
  const randomBytes = crypto.randomBytes(32) as Buffer; // Generate 32 bytes of random data
  return randomBytes.toString('base64'); // Convert to Base64 string (optional)
};

export const encrypt = (data: string): string => {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, crypto.randomBytes(32));
  return cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
};

export const decrypt = (data: string): string => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, crypto.randomBytes(16));
  return decipher.update(data, 'base64', 'utf8') + decipher.final('utf8');
};

export const base64Encode = (str: string): string => {
  return Buffer.from(str, 'utf8').toString('base64');
};

export const base64Decode = (str: string): string => {
  return Buffer.from(str, 'base64').toString('utf8');
};
