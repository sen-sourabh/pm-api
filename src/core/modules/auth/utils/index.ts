import { base64Decode } from '../../../helpers/security';
import { LoginRequestDto } from '../dtos/login.dto';

// INFO: Function Not In-Use
export const fetchHeaders = (request: any) => {
  const payload = base64Decode(request?.headers?.authorization?.split(' ')?.[1]);
  const userdata = payload?.split(':');

  return {
    email: userdata?.[0],
    password: userdata?.[1],
  } as LoginRequestDto;
};

export const getLocalDateTime = (): Date => {
  const localDateTime = new Date(); // Get current local datetime
  const utcDateTime = new Date(localDateTime.getTime() - localDateTime.getTimezoneOffset() * 60000); // Convert to UTC
  return new Date(utcDateTime.toISOString());
};
