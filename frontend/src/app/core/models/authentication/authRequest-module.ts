// app/core/models/login.model.ts

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean; // optional property
}

export interface RegisterRequest {
  email: string;
  firstname: string;
  lastname: string;

  date_of_birth: string;
  username: string;
  about: string;

  avatar: string;
  password: string;
  confirmpassword: string;
}
