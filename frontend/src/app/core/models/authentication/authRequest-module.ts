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

   username: string;
 
   password: string;
  confirmpassword: string;
}
