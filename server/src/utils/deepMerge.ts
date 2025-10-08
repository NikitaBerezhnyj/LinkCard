export const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
  for (const key of Object.keys(source) as (keyof T)[]) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (sourceValue && typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
      if (!targetValue || typeof targetValue !== "object") {
        (target[key] as unknown) = {};
      }
      deepMerge(target[key] as object, sourceValue as object);
    } else {
      (target[key] as unknown) = sourceValue;
    }
  }
  return target;
};
