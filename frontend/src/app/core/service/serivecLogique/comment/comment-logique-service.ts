import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentRequest } from '../../../models/comment/commentRequest';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/authentication/autResponse-module';
import { CommentResponse } from '../../../models/comment/CommentResponse';
import { environment, token } from '../../../constant/constante';
import { CommentService } from '../../servicesAPIREST/comment/comment-service';

@Injectable({
  providedIn: 'root'
})
export class CommentLogiqueService {
  

}
