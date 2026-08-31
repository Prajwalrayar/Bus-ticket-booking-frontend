export interface Register {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  userId: string;
  roles: string[];
  token: string;
}
