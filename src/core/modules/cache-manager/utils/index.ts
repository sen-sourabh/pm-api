import { CustomRequest } from '../../../shared/interfaces/types';

export const generateCacheKey = (request: CustomRequest): string => {
  const { url, method, query, params } = request;
  return JSON.stringify({ url, method, query, params });
};
