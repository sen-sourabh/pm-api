export const generateCacheKey = (request: Request): string => {
  const { url, method, query, params } = request as any;
  return JSON.stringify({ url, method, query, params });
};
