export interface ResetPasswordRequest {
  email: string;
  password: string;
  confirmedPassword: string;
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmedNewPassword: string;
  authId: string;
}
