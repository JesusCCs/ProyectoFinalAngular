export interface ResetPasswordRequest {
  email: string;
  password: string;
  confirmedPassword: string;
  token: string;
}
