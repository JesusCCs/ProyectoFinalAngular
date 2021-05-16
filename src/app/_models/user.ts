export interface User {
  id: string;
  authId: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  id: string;
  authId: string;
  accessToken: string;
  refreshToken: string;
  rememberMe: boolean;
}
