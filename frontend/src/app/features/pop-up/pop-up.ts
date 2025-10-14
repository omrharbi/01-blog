import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostResponse } from '../../core/models/postData/postResponse';
import { SharedServicePost } from '../../core/service/serivecLogique/shared-service/shared-service-post';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pop-up',
  imports: [],
  templateUrl: './pop-up.html',
  styleUrl: './pop-up.scss'
})
export class PopUp {
  @Input() post!: PostResponse;
  @Output() editPost = new EventEmitter<any>();
  constructor(private sharedService: SharedServicePost,private router:Router) { }

  onEdit() {
    this.editPost.emit(this.post); 

    console.log("edit",this.post);
  }

    
}
