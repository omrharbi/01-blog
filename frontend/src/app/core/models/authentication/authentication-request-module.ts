// app/core/models/login.model.ts

export interface authenticationRequest {
  email: string;
  password: string;
  rememberMe?: boolean; // optional property
}
