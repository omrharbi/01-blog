export interface JwtPayload {
  sub: string;      // username
  role: string;     // user role
  exp: number;      // expiration
  iat: number;      // issued at
  // add other claims as needed
  uuid: string;
}