import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, RegisterRequest } from './models/authentication/authRequest-module';
import { environment, LocalstorageKey } from './constant/constante';
import { ApiResponse, UserResponse } from './models/authentication/autResponse-module';
import { map } from 'rxjs';
import { Register } from '../features/auth/register/register';
import { Login } from '../features/auth/login/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  registrter(register: RegisterRequest) {}

  login(login: Login) {
    return this.http.post<ApiResponse<UserResponse>>(`${environment.auth.login}`, login).pipe(
      map((reponse) => {
        if (reponse.status && reponse.token) {
          localStorage.setItem(LocalstorageKey.token, reponse.token);
        }
        return reponse;
      })
    );
  }
}
