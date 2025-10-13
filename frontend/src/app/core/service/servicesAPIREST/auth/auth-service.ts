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
          // router.navigate(['/login']);
          localStorage.setItem(LocalstorageKey.token, response.token);
          localStorage.setItem(LocalstorageKey.refreshTokenKey, response.refreshToken);

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
          localStorage.setItem(LocalstorageKey.token, response.token);
          localStorage.setItem(LocalstorageKey.refreshTokenKey, response.refreshToken);
          this.isAuthenticatedSubject.next(true);

        }
        return response;
      })
    );
  }
  getRefreshToken(): string | null {

    return localStorage.getItem(LocalstorageKey.refreshTokenKey);
    // Or if using cookies: return this.getCookie('refreshToken');
  }
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem(LocalstorageKey.refreshTokenKey);
    return this.http.post(`${environment.auth.refreshToken}`, { refreshToken });
  }

  logout() {
    localStorage.removeItem(LocalstorageKey.token);
    localStorage.removeItem(LocalstorageKey.refreshTokenKey);
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
