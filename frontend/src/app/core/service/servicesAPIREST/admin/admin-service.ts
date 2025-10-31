import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../../models/authentication/authRequest-module';
import { environment, LocalstorageKey, token } from '../../../constant/constante';
import { ApiResponse, UserResponse } from '../../../models/authentication/autResponse-module';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Login } from '../../../../features/auth/login/login';
import { JwtService } from '../../JWT/jwt-service';
import { UserResponseInAdmin } from '../../../models/admin/UserResponseInAdmin';


@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // const router = inject(Router);
  constructor(private http: HttpClient, private jwtService: JwtService) { }
  // private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  urlImageUser: string = ""
  // public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  getAllUsers(): Observable<ApiResponse<UserResponseInAdmin[]>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })

    return this.http.get<ApiResponse<UserResponseInAdmin[]>>
      (`${environment.admin.getUsers}`, {
        headers
      })
  }

  // getCurrentUserUUID(): string | null {
  //   const token = this.getToken();
  //   return token ? this.jwtService.getUUIDFromToken(token) : null;
  // }


  // getCurrentUsername(): string | null {
  //   const token = this.getToken();
  //   return token ? this.jwtService.getUsernameFromToken(token) : null;
  // }

  // hasRole(role: string): boolean {
  //   const userRole = this.getCurrentUserRole();
  //   return userRole === role;
  // }
  // isAuthenticated(): boolean {
  //   const token = this.getToken();
  //   return token ? !this.jwtService.isTokenExpired(token) : false;
  // }
}
