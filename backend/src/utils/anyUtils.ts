import { logger } from "../app";

const snakeToCamel = (str: string) =>
  str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );

export const camelCaseKeys = (
  obj: any
): Record<string, unknown> | unknown[] => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelCaseKeys(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key: string) => ({
        ...result,
        [snakeToCamel(key)]: camelCaseKeys(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

export const parseFloatOrNull = (val: string): number | null => {
  const parsed = parseFloat(val);
  if (!parsed) {
    logger.info(`${val} cannot be parsed to float, returning null`);
    return null;
  }
  return parsed;
};
