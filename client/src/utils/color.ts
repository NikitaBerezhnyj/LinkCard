const FALLBACK_COLOR = "#2c5f4a";

function hexToRgb(hex: string | undefined | null): [number, number, number] {
  const value = isValidHex(hex) ? hex! : FALLBACK_COLOR;
  const normalized = value.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map(c => c + c)
          .join("")
      : normalized;

  const num = parseInt(expanded, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function isValidHex(hex: string | undefined | null): hex is string {
  return typeof hex === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex);
}

function clamp(value: number): number {
  return Math.min(255, Math.max(0, value));
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map(c => clamp(Math.round(c)).toString(16).padStart(2, "0")).join("");
}

export function shade(hex: string | undefined, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  const factor = percent / 100;
  const mix = factor > 0 ? [255, 255, 255] : [0, 0, 0];
  const amount = Math.abs(factor);

  return rgbToHex([
    r + (mix[0] - r) * amount,
    g + (mix[1] - g) * amount,
    b + (mix[2] - b) * amount
  ]);
}

export function isLightColor(hex: string | undefined): boolean {
  const [r, g, b] = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}
