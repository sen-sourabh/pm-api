export const isMissing = (value: any) => value === undefined || value === null;

export const isMissingOrEmpty = (value: any) =>
  value === undefined || value === null || value?.trim() === '';

export const containsKey = (object: any, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(object, key);
