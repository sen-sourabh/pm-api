const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isMissing = (value: unknown): boolean => value === undefined || value === null;

export const isMissingOrEmpty = (value: string): boolean =>
  value === undefined || value === null || value?.trim() === '';

export const containsKey = (object: Record<string, unknown>, key: string): boolean =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  Object.prototype.hasOwnProperty.call(object, key);

export const validateEmail = (value: string): boolean => emailRegex.test(value);
