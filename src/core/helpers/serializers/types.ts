import { CustomRequest, CustomResponse } from '../../shared/interfaces/types';

export interface ActivityLogResponse {
  handler?: string | null;
  method?: string;
  headers?: Headers;
  request?: CustomRequest;
  response?: CustomResponse;
  responseCode?: number;
  ipAddress?: string;
  location?: string | null;
}

export interface IApiPagination {
  skip?: number;
  take?: number;
  relations?: boolean;
}
