export type ITextAlign = "left" | "center" | "right";

export type IFontWeight = "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";

export type IBackgroundType = "color" | "gradient" | "image";

export type IBackgroundPosition =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top left"
  | "top right"
  | "bottom left"
  | "bottom right";

export type IBackgroundSize = "cover" | "contain" | "auto";

export type IBackgroundRepeat = "repeat" | "no-repeat" | "repeat-x" | "repeat-y";

export interface ITypography {
  font?: string;
  fontSize?: string;
  fontWeight?: IFontWeight;
  textAlign?: ITextAlign;
}

export interface IButtonColors {
  text?: string;
  background?: string;
  hoverText?: string;
  hoverBackground?: string;
}

export interface IColorScheme {
  text?: string;
  linkText?: string;
  border?: string;
  contentBackground?: string;
  button: IButtonColors;
}

export interface ILayout {
  borderRadius?: string;
  contentPadding?: string;
  contentGap?: string;
}

export interface IGradient {
  start?: string;
  end?: string;
  angle?: string;
}

export interface IBackground {
  type: IBackgroundType;
  color?: string;
  gradient?: IGradient;
  image?: string;
  position?: IBackgroundPosition;
  size?: IBackgroundSize;
  repeat?: IBackgroundRepeat;
}

export interface IUserStyles {
  typography: ITypography;
  colors: IColorScheme;
  layout: ILayout;
  background: IBackground;
}
