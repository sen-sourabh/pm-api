import { TransformFnParams } from 'class-transformer';

// INFO: Function Not In-Use
export const stringToBoolean = (params: TransformFnParams): boolean => {
  const value = params.value as string;
  return value === 'true' || value === '1';
};
