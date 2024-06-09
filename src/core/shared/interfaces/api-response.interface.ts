import { ApiResponseCommonModel } from '../models/api-response.model';

export interface ApiResponseModel<T> extends ApiResponseCommonModel {
  data?: T;
  metadata?: { query?: unknown };
  statusCode?: number;
  status?: string;
  message?: string;
  timestamp?: Date;
}
