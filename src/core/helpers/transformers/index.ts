import { TransformFnParams } from 'class-transformer';
import { LoginRequestDto } from '../../../modules/auth/dtos/login.dto';
import { base64Decode } from '../security';

export const stringToBoolean = (params: TransformFnParams): boolean => {
  const value = params.value as string;
  return value === 'true' || value === '1';
};

export const fetchHeaders = (request: any) => {
  const payload = base64Decode(request?.headers?.authorization?.split(' ')?.[1]);
  const userdata = payload?.split(':');

  return {
    email: userdata?.[0],
    password: userdata?.[1],
  } as LoginRequestDto;
};
