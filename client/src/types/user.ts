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

export type IDeepPartial<T> = T extends object ? { [P in keyof T]?: IDeepPartial<T[P]> } : T;

export interface IUpdateUserDto {
  username?: string;
  email?: string;
  bio?: string;
  links?: IUserLink[];
  styles?: IDeepPartial<IUserStyles>;
}
