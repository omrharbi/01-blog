import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest, RegisterRequest } from '../models/authentication/authRequest-module';
import { environment, LocalstorageKey } from '../constant/constante';
import { ApiResponse, UserResponse } from '../models/authentication/autResponse-module';
import { map } from 'rxjs';
import { Register } from '../../features/auth/register/register';
import { Login } from '../../features/auth/login/login';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // const router = inject(Router);
  constructor(private http: HttpClient) {}

  registrter(register: RegisterRequest) {
    return this.http.post<ApiResponse<UserResponse>>(`${environment.auth.register}`, register).pipe(
      map((response) => {
        if (response.status && response.token) {
          // router.navigate(['/login']);
          localStorage.setItem(LocalstorageKey.token, response.token);
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
          localStorage.setItem(LocalstorageKey.token, response.token);
        }
        return response;
      })
    );
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('USER_TOKEN');
    return !!token;
  }
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
