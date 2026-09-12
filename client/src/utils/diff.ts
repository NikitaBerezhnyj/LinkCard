export type IDeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends readonly unknown[]
      ? T[K]
      : IDeepPartial<T[K]>
    : T[K];
};

export function getObjectDiff<T extends Record<string, unknown>>(
  original: T,
  draft: T
): IDeepPartial<T> {
  const diff: Record<string, unknown> = {};

  for (const key of Object.keys(draft)) {
    const originalValue = original[key];
    const draftValue = draft[key];

    if (Object.is(originalValue, draftValue)) {
      continue;
    }

    if (isPlainObject(originalValue) && isPlainObject(draftValue)) {
      const nestedDiff = getObjectDiff(originalValue, draftValue);

      if (Object.keys(nestedDiff).length > 0) {
        diff[key] = nestedDiff;
      }

      continue;
    }

    diff[key] = draftValue;
  }

  return diff as IDeepPartial<T>;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
