export const isMissing = (value: any) => value === undefined || value === null;

export const containsKey = (object: any, key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(object, key);
};
