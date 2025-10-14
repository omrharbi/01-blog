import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostResponse } from '../../core/models/postData/postResponse';

@Component({
  selector: 'app-pop-up',
  imports: [],
  templateUrl: './pop-up.html',
  styleUrl: './pop-up.scss'
})
export class PopUp {
  @Input() post!: PostResponse;
  isEdit: boolean = false;

  @Output() editPost = new EventEmitter<any>();

  onEdit() {
    this.editPost.emit(this.post);
  }
 
}
