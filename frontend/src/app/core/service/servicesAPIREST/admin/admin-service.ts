import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../../models/authentication/authRequest-module';
import { environment, LocalstorageKey, token } from '../../../constant/constante';
import { ApiResponse, UserResponse } from '../../../models/authentication/autResponse-module';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Login } from '../../../../features/auth/login/login';
import { JwtService } from '../../JWT/jwt-service';
import { UserResponseInAdmin } from '../../../models/admin/UserResponseInAdmin';
import { ApiResponseWithPage } from '../../../models/post/postResponse';


@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient, private jwtService: JwtService) { }
  urlImageUser: string = ""
  getAllUsers(page: number, size: number): Observable<ApiResponseWithPage<UserResponseInAdmin[]>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })

    return this.http.get<ApiResponseWithPage<UserResponseInAdmin[]>>
      (`${environment.admin.getUsers}?page=${page}&size=${size}`, {
        headers
      })
  }

  getAllPosts(page: number, size: number): Observable<ApiResponseWithPage<UserResponseInAdmin[]>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })

    return this.http.get<ApiResponseWithPage<UserResponseInAdmin[]>>
      (`${environment.admin.getPosts}?page=${page}&size=${size}`, {
        headers
      })
  }

  deletePost(postId: string): Observable<ApiResponseWithPage<UserResponseInAdmin>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })

    return this.http.delete<ApiResponseWithPage<UserResponseInAdmin>>
      (`${environment.admin.deletePosts}${postId}`, {
        headers
      })
  }
  banUser(userId: string, days: number): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    return this.http.patch<ApiResponse<any>>(
      `${environment.admin.banUser}${userId}?days=${days}`,
      {
        headers
      }
    )
  }


  changeRole(userId: string): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    return this.http.patch<ApiResponse<any>>(
      `${environment.admin.changeRole}${userId}`,
      {
        headers
      }
    )
  }

  deleteUser(userId: string): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    return this.http.delete<ApiResponse<any>>(
      `${environment.admin.deleteUser}${userId}`,
      {
        headers
      }
    )
  }


  getAdmins(page: number, size: number): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    return this.http.get<ApiResponse<any>>(
      `${environment.admin.admins}?page=${page}&size=${size}`,
      {
        headers
      }
    )
  }

  activeUsers(page: number, size: number): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    return this.http.get<ApiResponse<any>>(
      `${environment.admin.activeUsers}?page=${page}&size=${size}`,
      {
        headers
      }
    )
  }

  bannedUser(page: number, size: number): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    return this.http.get<ApiResponse<any>>(
      `${environment.admin.bannedUser}?page=${page}&size=${size}`,
      {
        headers
      }
    )
  }

  getcountUsers(): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    return this.http.get<ApiResponse<any>>(
      `${environment.admin.countUsers}`,
      {
        headers
      }
    )
  }


  getcountPosts(): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    return this.http.get<ApiResponse<any>>(
      `${environment.admin.allPosts}`,
      {
        headers
      }
    )
  }
}
