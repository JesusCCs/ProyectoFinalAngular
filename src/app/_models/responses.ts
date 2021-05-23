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
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
