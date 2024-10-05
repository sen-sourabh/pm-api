import { AuthUserPayload } from '../../modules/auth/types';

export interface CustomResponse extends Response {
  statusCode?: number;
  message?: string;
}

export interface CustomRequest extends Request {
  query: Record<string, unknown>;
  params: Record<string, unknown>;
  ip: string;
}

export interface ApiJWTDecoded {
  header: {
    alg: string;
    type: string;
  };
  payload: AuthUserPayload;
  signature: string;
}
