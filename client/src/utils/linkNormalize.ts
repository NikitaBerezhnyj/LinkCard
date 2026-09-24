import { isPhone } from "./validations";
// eslint-disable-next-line sonarjs/super-linear-regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BARE_DOMAIN_REGEX = /^[\w-]+(\.[\w-]+)+(\/.*)?$/;

export function normalizeLinkUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  const lower = trimmed.toLowerCase();

  if (lower.startsWith("mailto:") || lower.startsWith("tel:") || lower.includes("://")) {
    return trimmed;
  }

  if (EMAIL_REGEX.test(trimmed)) {
    return `mailto:${trimmed}`;
  }

  if (isPhone(trimmed)) {
    const digitsOnly = trimmed.replace(/[^\d+]/g, "");
    return `tel:${digitsOnly}`;
  }

  if (BARE_DOMAIN_REGEX.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

export function denormalizeLinkUrl(url: string): string {
  const lower = url.toLowerCase();

  if (lower.startsWith("mailto:")) return url.slice("mailto:".length);
  if (lower.startsWith("tel:")) return url.slice("tel:".length);

  return url;
}
