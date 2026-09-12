import { CSSProperties } from "react";
import { IUserStyles } from "@/types/styles";

type CardCssVars = CSSProperties & { [key: `--${string}`]: string | number | undefined };

function buildBackgroundVars(styles: IUserStyles): Partial<CardCssVars> {
  const { background } = styles;
  const value = background;

  switch (background.type) {
    case "color":
      return { "--card-bg-color": value.color };
    case "gradient":
      if (!value.gradient) return {};
      return {
        "--card-bg-image": `linear-gradient(${value.gradient.angle ?? "180deg"}, ${value.gradient.start ?? "#000"}, ${value.gradient.end ?? "#000"})`
      };
    case "image":
      if (!value.image) return {};
      return {
        "--card-bg-image": `url(${value.image})`,
        "--card-bg-repeat": value.repeat,
        "--card-bg-size": value.size,
        "--card-bg-position": value.position
      };
    default:
      return {};
  }
}

export function buildCardStyle(styles: IUserStyles): CardCssVars {
  const { typography, colors, layout } = styles;

  return {
    "--card-font-family": typography.font,
    "--card-font-size": typography.fontSize,
    "--card-font-weight": typography.fontWeight,
    "--card-text-align": typography.textAlign,
    "--card-text-color": colors.text,
    "--card-link-text-color": colors.linkText,
    "--card-border-color": colors.border,
    "--card-content-bg": colors.contentBackground,
    "--card-button-text": colors.button?.text,
    "--card-button-bg": colors.button?.background,
    "--card-button-hover-text": colors.button?.hoverText,
    "--card-button-hover-bg": colors.button?.hoverBackground,
    "--card-border-radius": layout.borderRadius,
    "--card-content-padding": layout.contentPadding,
    "--card-content-gap": layout.contentGap,
    ...buildBackgroundVars(styles)
  };
}
