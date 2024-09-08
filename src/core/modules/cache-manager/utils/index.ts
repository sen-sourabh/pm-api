export const generateCacheKey = (request: Request): string => {
  const { url, method, query, params } = request;
  return JSON.stringify({ url, method, query, params });
};
