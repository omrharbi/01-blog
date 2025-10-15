// interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { apiUrl, environment, LocalstorageKey } from '../core/constant/constante';
import { AuthService } from '../core/service/servicesAPIREST/auth/auth-service';
import { NotificationService } from '../core/service/notificationAlert/NotificationService';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);//NotificationService
  const notificationAlert = inject(NotificationService);//NotificationService


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
  // ✅ Add Authorization header if logged in
  const token = localStorage.getItem(LocalstorageKey.token);
  // if (token === null) {
  //   notificationAlert.showError('Your session has expired. Please log in again.', true);
  //   return throwError(() => new Error('Unauthorized'));
  // }
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
        const isLoggedIn = authService.isLoggedIn();

        if (isLoggedIn) {
          notificationAlert.showError('Your session has expired. Please log in again.', true);
        } else {
          notificationAlert.showError('You must be logged in to continue.', true);
        }
      }
      return throwError(() => error);
    })
  );


};