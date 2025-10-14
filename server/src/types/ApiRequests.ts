import { IUser } from "../models/userModel";

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface RegisterUserDTO {
  email: string;
  username: string;
  password: string;
}

export interface ResetPasswordDTO {
  password: string;
}

export type UpdateUserDTO = Partial<
  Pick<IUser, "username" | "email" | "avatar" | "bio" | "links" | "styles">
>;
