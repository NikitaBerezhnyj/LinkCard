export const parseUnitValue = (value: string | number): number => {
  if (typeof value === "number") return value;
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

export const formatUnitValue = (
  value: string | number,
  unit: "px" | "deg" | "%" = "px"
): string => {
  if (typeof value === "string" && value.endsWith(unit)) return value;
  return `${parseUnitValue(value)}${unit}`;
};
