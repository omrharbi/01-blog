import { Component, Input } from '@angular/core';
import { PostResponse } from '../../core/models/post/postResponse';

@Component({
  selector: 'app-comment',
  imports: [],
  templateUrl: './comment.html',
  styleUrl: './comment.scss'
})
export class Comment {
  @Input() post!: PostResponse;
}
