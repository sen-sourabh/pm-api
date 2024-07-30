import { ApiResponseUnifiedModel } from '../models/api-response.model';

export interface ApiResponseModel<T> extends ApiResponseUnifiedModel {
  data?: T;
  metadata?: {
    query?: unknown;
    params?: unknown;
    body?: unknown;
  };
  statusCode?: number;
  status?: string;
  message?: string;
  timestamp?: Date;
}
