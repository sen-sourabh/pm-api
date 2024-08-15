export const generateCustomFieldKey = ({ name }: { name?: string }): string => {
  return `cf_${generateCFKeyName(name)}`;
};

const generateCFKeyName = (name: string): string => {
  return name?.trim()?.toLowerCase()?.replace(/\s+/g, '_');
};
