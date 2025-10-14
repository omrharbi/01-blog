import { Component, Input } from '@angular/core';
import { PostResponse } from '../../core/models/postData/postResponse';
import { SharedServicePost } from '../../core/service/serivecLogique/shared-service/shared-service-post';

@Component({
  selector: 'app-pop-up',
  imports: [],
  templateUrl: './pop-up.html',
  styleUrl: './pop-up.scss'
})
export class PopUp {
  @Input() post!: PostResponse;
  constructor(private sharedService: SharedServicePost) { }

  onEdit() {
    this.sharedService.editPost(this.post);
  }
}
