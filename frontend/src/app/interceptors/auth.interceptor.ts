// interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { apiUrl, environment, LocalstorageKey } from '../core/constant/constante';
import { AuthService } from '../core/service/servicesAPIREST/auth/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const skipApiEndpoints = [
    environment.auth.login,        // "http://localhost:9090/auth/login"
    environment.auth.register,     // "http://localhost:9090/auth/register" 
  ];

  const isAuthApiCall = skipApiEndpoints.some(endpoint =>
    req.url.includes(endpoint.replace(apiUrl, '')) || 
    req.url === endpoint
  );

  if (isAuthApiCall) {
    return next(req);
  }

  const token = localStorage.getItem(LocalstorageKey.token);
  const authReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req;

  return next(authReq).pipe(
    catchError((error) => {

      if (error.status === 401) {

        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};