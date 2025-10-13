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

  console.log('🔧 Interceptor checking URL:', req.url);

  // Only skip AUTH API ENDPOINTS (HTTP calls to backend)
  const skipApiEndpoints = [
    environment.auth.login,        // "http://localhost:9090/auth/login"
    environment.auth.register,     // "http://localhost:9090/auth/register" 
    environment.auth.refreshToken  // "http://localhost:9090/auth/refreshtoken"
  ];

  // Check if this request is going to an auth API endpoint
  const isAuthApiCall = skipApiEndpoints.some(endpoint => 
    req.url.includes(endpoint.replace(apiUrl, '')) || // Remove base URL for comparison
    req.url === endpoint
  );

  if (isAuthApiCall) {
    console.log('✅ Skipping interceptor for auth API:', req.url);
    return next(req);
  }

  console.log('🔐 Adding token to API call:', req.url);
  
  // Add token to all other API requests
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
      console.log('❌ Interceptor caught error for:', req.url, error.status);
      
      if (error.status === 401) {
        console.log('🚪 401 detected - logging out and redirecting');
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};