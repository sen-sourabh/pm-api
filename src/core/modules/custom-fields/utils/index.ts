export const generateCustomFieldKey = ({ name }: { name?: string }): string => {
  return `cf_${Date.now()}`;
};
