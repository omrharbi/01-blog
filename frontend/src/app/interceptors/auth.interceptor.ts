import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { environment, LocalstorageKey } from '../core/constant/constante';
import { AuthService } from '../core/service/servicesAPIREST/auth/auth-service';
import { JwtHelperService } from '@auth0/angular-jwt'; // Install: npm install @auth0/angular-jwt
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

 
  private jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService,private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.includes(environment.auth.login) || req.url.includes(environment.auth.register)) {
      return next.handle(req);
    }
    const authToken = this.addToken(req);

    // Check if token is expired but user is still "logged in"
    if (this.isTokenExpired() && this.isUserLoggedIn()) {
      return this.handle401Error();
    }

    return next.handle(authToken).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error();
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

  private handle401Error(): Observable<HttpEvent<any>> {

    this.authService.logout();
    this.router.navigate(['/login']);
    return throwError(() => new Error('Authentication failed: Token expired or invalid'));

  }


}