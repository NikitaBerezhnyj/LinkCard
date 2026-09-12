const PHONE_REGEX = /^(tel:)?\+?\d[0-9\s\-()]{6,}$/;

export function isPhone(value: string): boolean {
  return PHONE_REGEX.test(value.trim());
}
