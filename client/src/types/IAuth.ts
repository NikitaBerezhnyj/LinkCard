export interface IAuthResponse {
  token: string;
  username: string;
  message: string;
}

export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}
