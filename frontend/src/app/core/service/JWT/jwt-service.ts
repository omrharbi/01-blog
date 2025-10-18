import { Injectable } from '@angular/core';
import { JwtPayload } from '../../models/JWT/JwtPayload';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  decodeToken(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];
      const decodePayload = atob(payload.replace(/-/g, '+').replace('/_/', '/'));
      return JSON.parse(decodePayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  getUsernameFromToken(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.sub || null;
  }

  getRoleFromToken(token: string): string | null {
    const payload = this.decodeToken(token);
      // console.log(payload);

    return payload?.uuid || null;
  }
  getUUIDFromToken(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.role || null;
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload?.exp) return true;
    const expirationDate = new Date(payload.exp * 1000); // Convert to milliseconds
    return expirationDate < new Date();
  }
}
