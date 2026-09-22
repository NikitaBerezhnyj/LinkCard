export type IBackgroundType = "color" | "gradient" | "image";

export interface IBackground {
  type: IBackgroundType;
  color?: string;
  image?: string;
}

export interface IUserStyles {
  font: string;
  accentColor: string;
  background: IBackground;
}
