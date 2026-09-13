import { IUserStyles } from "./styles";

export interface IUserLink {
  id: string;
  title: string;
  url: string;
  order: number;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  links: IUserLink[];
  styles: IUserStyles;
}

export interface IUpdateLinkPayload {
  id?: string;
  title: string;
  url: string;
}

export interface IUpdateUserPayload {
  username?: string;
  email?: string;
  bio?: string;
  links?: IUpdateLinkPayload[];
  styles?: IDeepPartial<IUserStyles>;
}

export interface IUploadAvatarResponse {
  avatarUrl: string;
}

export interface IUploadBackgroundResponse {
  backgroundUrl: string;
}

export type IDeepPartial<T> = T extends object ? { [P in keyof T]?: IDeepPartial<T[P]> } : T;
