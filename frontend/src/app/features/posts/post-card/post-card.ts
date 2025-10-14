import { Component, Input, SimpleChanges } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { apiUrl } from '../../../core/constant/constante';
import { PopUp } from '../../pop-up/pop-up';

@Component({
  selector: 'app-post-card',
  imports: [Materaile,PopUp],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss'
})
export class PostCard {
  apiUrl = apiUrl
  @Input() post: any;
  show = false;
  popUp() {
    this.show = !this.show;
    console.log("hwwe",this.show);
  }
}
