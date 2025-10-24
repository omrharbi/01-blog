import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostResponse } from '../../core/models/post/postResponse';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';
import { JwtService } from '../../core/service/JWT/jwt-service';
import { Materaile } from '../../modules/materaile-module';
import { CommonModule } from '@angular/common';
import { PostService } from '../../core/service/servicesAPIREST/posts/post-service';

@Component({
  selector: 'app-pop-up',
  // imports: [Materaile],
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pop-up.html',
  styleUrl: './pop-up.scss'
})
export class PopUp {
  constructor(private auth: AuthService, private user: JwtService,private postService:PostService) {
  }
  @Input() isOwner: boolean = false;
  isAuthenticated: boolean = false;
  uuid: string = "0";
  @Input() post!: PostResponse;
  ngOnInit() {
    this.isAuthenticated = this.auth.isAuthenticated();
  }
  isEdit: boolean = false;

  @Output() editPost = new EventEmitter<any>();

  onEdit() {
    this.editPost.emit(this.post);
  }

  onDelete() {
    console.log(this.post.id);
    this.postService.DeletePost(this.post.id).subscribe({
      next:response=>{
        console.log(response);
        
      },
      error:error=>{
        console.log(error);
        
      }
    })
  }
}
