import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../../models/authentication/authRequest-module';
import { environment, LocalstorageKey } from '../../../constant/constante';
import { ApiResponse, UserResponse } from '../../../models/authentication/autResponse-module';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Login } from '../../../../features/auth/login/login';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // const router = inject(Router);
  constructor(private http: HttpClient) { }
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  registrter(register: RegisterRequest) {
    return this.http.post<ApiResponse<UserResponse>>(`${environment.auth.register}`, register).pipe(
      map((response) => {
        if (response.status && response.token) {
          this.storeTokens(response);
          this.isAuthenticatedSubject.next(true);
          console.log(response);
        }
        return response;
      })
    );
  }

  login(login: Login) {
    return this.http.post<ApiResponse<UserResponse>>(`${environment.auth.login}`, login).pipe(
      map((response) => {
        if (response.status && response.token) {
          this.storeTokens(response);
          this.isAuthenticatedSubject.next(true);

        }
        return response;
      })
    );
  }
  getRefreshToken(): string | null {

    return localStorage.getItem(LocalstorageKey.refreshTokenKey);
  }
  // auth.service.ts
  validateTokenOnStartup() {
    const token = localStorage.getItem(LocalstorageKey.token);

    if (!token) {
      // No token - user is not really logged in
      this.logout();
      return;
    }

    // Optional: Check if token is expired using jwtHelper
    // if (this.jwtHelper.isTokenExpired(token)) {
    //   // Token expired - logout user
    //   this.logout();
    //   return;
    // }

    // Token exists and is valid - user stays logged in
    this.isAuthenticatedSubject.next(true);
  }
  private storeTokens(response: any): void {
    localStorage.setItem(LocalstorageKey.token, response.accessToken);
  }
  logout() {
    localStorage.removeItem(LocalstorageKey.token);
    this.isAuthenticatedSubject.next(false);

  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(LocalstorageKey.token);
    return !!token;
  }
  getToken(): string | null {
    return localStorage.getItem(LocalstorageKey.token);
  }
}
