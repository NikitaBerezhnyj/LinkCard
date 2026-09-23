import { DEFAULT_CARD_FONT } from "@/constants/cardFonts";
import { IUserStyles } from "@/types/styles";
import { isLightColor, shade } from "@/utils/color";
import { CSSProperties } from "react";

const DEFAULT_FONT = DEFAULT_CARD_FONT;
const DEFAULT_ACCENT = "#2c5f4a";

export function buildCardStyle(styles: IUserStyles | undefined | null): CSSProperties {
  const font = styles?.font ?? DEFAULT_FONT;
  const accentColor = styles?.accentColor ?? DEFAULT_ACCENT;
  const background = styles?.background ?? { type: "color" as const };

  const vars: Record<string, string> = {
    "--card-font-family": font,
    "--card-accent-color": accentColor,
    "--card-accent-contrast": isLightColor(accentColor) ? "#1a1a1a" : "#ffffff",
    "--page-bg-color": accentColor,
    "--page-bg-image": "none"
  };

  if (background.type === "color") {
    vars["--page-bg-color"] = background.color ?? accentColor;
  } else if (background.type === "gradient") {
    const base = background.gradientColor ?? accentColor;
    vars["--page-bg-color"] = shade(base, 55);
    vars["--page-bg-image"] = `linear-gradient(135deg, ${shade(base, 55)}, ${shade(base, -15)})`;
  } else if (background.type === "image" && background.image) {
    vars["--page-bg-image"] = `url(${background.image})`;
  }

  return vars as CSSProperties;
}
