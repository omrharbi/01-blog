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
  const router = inject(Router);
  const notificationAlert = inject(NotificationService);

  // Skip auth endpoints
  const skipApiEndpoints = [
    environment.auth.login,
    environment.auth.register,
  ];

  const isAuthApiCall = skipApiEndpoints.some(endpoint =>
    req.url.includes(endpoint.replace(apiUrl, '')) ||
    req.url === endpoint
  );

  if (isAuthApiCall) {
    return next(req);
  }

  // Add Authorization header if logged in
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
      const status = error.status;

      // Prevent infinite loops - don't intercept errors on error page
      const currentUrl = router.url;
      if (currentUrl.includes('/error')) {
        return throwError(() => error);
      }

      switch (status) {
        case 401:
          // Only logout if user was logged in
          if (authService.isLoggedIn()) {
            authService.logout();
          }
          router.navigate(['/error'], {
            queryParams: { status: 401 },
            skipLocationChange: false
          });
          break;

        case 403:
          router.navigate(['/error'], {
            queryParams: { status: 403 }
          });
          break;

        case 404:
          router.navigate(['/error'], {
            queryParams: { status: 404 }
          });
          break;

        case 400:
          router.navigate(['/error'], {
            queryParams: { status: 400 }
          });
          break;

        // case 500:
        //   router.navigate(['/error'], {
        //     queryParams: { status: 500 }
        //   });
        //   break;

        // case 503:
        //   router.navigate(['/error'], {
        //     queryParams: { status: 503 }
        //   });
        //   break;

        default:
          // For other errors, just log them without redirecting
          console.error('HTTP Error:', error);
          break;
      }

      return throwError(() => error);
    })
  );
};