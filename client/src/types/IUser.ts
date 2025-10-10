export interface ILink {
  title: string;
  url: string;
}

export interface IGradientValue {
  start: string;
  end: string;
  angle: string;
}

export interface IBackgroundValue {
  color: string;
  gradient?: IGradientValue;
  image?: string;
  position?: string;
  size?: string;
  repeat?: string;
}

export interface IUserStyles {
  font: string;
  fontSize: string;
  fontWeight: string;
  textAlign: string;
  text: string;
  linkText: string;
  buttonText: string;
  buttonBackground: string;
  buttonHoverText: string;
  buttonHoverBackground: string;
  border: string;
  borderRadius: string;
  contentBackground: string;
  contentPadding: string;
  contentGap: string;
  background: {
    type: "color" | "gradient" | "image";
    value: IBackgroundValue;
  };
}

export interface IUser {
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  links: ILink[];
  styles: IUserStyles;
}

export interface IUserResponse {
  message: string;
  data: IUser;
}

export interface IUserProfileResponse {
  id: string;
  username: string;
  email: string;
}
