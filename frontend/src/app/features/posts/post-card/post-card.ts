import { Component, Input, SimpleChanges } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';

@Component({
  selector: 'app-post-card',
  imports: [Materaile],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss'
})
export class PostCard {
 @Input() post: any;
  
}
