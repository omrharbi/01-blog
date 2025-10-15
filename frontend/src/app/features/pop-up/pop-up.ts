import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostResponse } from '../../core/models/postData/postResponse';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';
import { JwtService } from '../../core/service/JWT/jwt-service';

@Component({
  selector: 'app-pop-up',
  imports: [],
  templateUrl: './pop-up.html',
  styleUrl: './pop-up.scss'
})
export class PopUp {
  constructor(private auth: AuthService,private user :JwtService) {
  }
  isAuthenticated: boolean = false;
  ngOnInit() {
    this.isAuthenticated = this.auth.isLoggedIn();
  }
  @Input() post!: PostResponse;
  isEdit: boolean = false;

  @Output() editPost = new EventEmitter<any>();

  onEdit() {
    this.editPost.emit(this.post);
  }

}
