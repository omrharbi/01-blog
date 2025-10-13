import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { LocalstorageKey } from '../core/constant/constante';
import { AuthService } from '../core/service/servicesAPIREST/auth/auth-service';
import { JwtHelperService } from '@auth0/angular-jwt'; // Install: npm install @auth0/angular-jwt

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip token for login, register, and refresh token endpoints
    if (req.url.includes('/auth/login') || 
        req.url.includes('/auth/register') || 
        req.url.includes('/auth/refresh')) {
      return next.handle(req);
    }

    const authToken = this.addToken(req);
    
    // Check if token is expired but user is still "logged in"
    if (this.isTokenExpired() && this.isUserLoggedIn()) {
      return this.handle401Error(authToken, next);
    }

    return next.handle(authToken).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(authToken, next);
        }
        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = localStorage.getItem(LocalstorageKey.token);
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return request;
  }

  private isTokenExpired(): boolean {
    const token = localStorage.getItem(LocalstorageKey.token);
    if (!token) return true;
    
    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      return true;
    }
  }

  private isUserLoggedIn(): boolean {
    const token = localStorage.getItem(LocalstorageKey.token);
    const refreshToken = localStorage.getItem(LocalstorageKey.refreshTokenKey);
    return !!(token && refreshToken);
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          
          // Store new tokens
          localStorage.setItem(LocalstorageKey.token, response.accessToken);
          if (response.refreshToken) {
            localStorage.setItem(LocalstorageKey.refreshTokenKey, response.refreshToken);
          }
          
          this.refreshTokenSubject.next(response.accessToken);
          
          // Retry the original request with new token
          return next.handle(this.addToken(request));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          
          // If refresh fails, logout user
          this.authService.logout();
          return throwError(err);
        })
      );
    } else {
      // Wait while token is being refreshed
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request));
        })
      );
    }
  }
}