import { IUser } from "../models/userModel";

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export type UserResponse = ApiResponse<
  Pick<IUser, "username" | "email" | "avatar" | "bio" | "links" | "styles">
>;

export interface AuthResponse extends ApiResponse<{ username: string }> {
  token?: string;
}
