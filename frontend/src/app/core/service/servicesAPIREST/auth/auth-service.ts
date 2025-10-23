import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../../models/authentication/authRequest-module';
import { environment, LocalstorageKey } from '../../../constant/constante';
import { ApiResponse, UserResponse } from '../../../models/authentication/autResponse-module';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Login } from '../../../../features/auth/login/login';
import { JwtService } from '../../JWT/jwt-service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // const router = inject(Router);
  constructor(private http: HttpClient, private jwtService: JwtService) { }
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  urlImageUser: string = ""
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  registrter(register: RegisterRequest) {
    return this.http.post<ApiResponse<UserResponse>>(`${environment.auth.register}`, register).pipe(
      map((response) => {
        if (response.status && response.token) {
          this.isAuthenticatedSubject.next(true);
          // console.log(response);
        }
        return response;
      })
    );
  }

  login(login: Login) {
    return this.http.post<ApiResponse<UserResponse>>(`${environment.auth.login}`, login).pipe(
      map((response) => {
        if (response.status && response.token) {
          localStorage.setItem(LocalstorageKey.token, response.token);
          this.isAuthenticatedSubject.next(true);
          this.urlImageUser = response.data.avater;
        }
        return response;
      })
    );
  }

  validateTokenOnStartup() {
    const token = localStorage.getItem(LocalstorageKey.token);
    if (!token) {
      // No token - user is not really logged in
      this.logout();
      return;
    }
    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    localStorage.removeItem(LocalstorageKey.token);
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(LocalstorageKey.token);
    return !!token;
  }
  private getToken(): string | null {
    return localStorage.getItem(LocalstorageKey.token);
  }

  getCurrentUserRole(): string | null {
    const token = this.getToken();
    // console.log(token);
    
    return token ? this.jwtService.getRoleFromToken(token) : null;
  }

  getCurrentUserUUID(): string | null {
    const token = this.getToken();
    return token ? this.jwtService.getUUIDFromToken(token) : null;
  }


  getCurrentUsername(): string | null {
    const token = this.getToken();
    return token ? this.jwtService.getUsernameFromToken(token) : null;
  }

  hasRole(role: string): boolean {
    const userRole = this.getCurrentUserRole();
    return userRole === role;
  }
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtService.isTokenExpired(token) : false;
  }
}
