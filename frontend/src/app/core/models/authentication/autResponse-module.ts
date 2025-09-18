// app/core/models/login.model.ts

export interface UserResponse {
  _id: number;
  username: string;
  email: string;
}

export interface ApiResponse<T> {
  status?: boolean;
  message?: string;
  error?: string;
  token?: string;
  data: T;
}
