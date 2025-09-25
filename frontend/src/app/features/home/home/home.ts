import { Component } from '@angular/core';
import { CardShare } from '../card-share/card-share';
import { Materaile } from '../../../modules/materaile-module';
import { PostCard } from '../../posts/post-card/post-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardShare,PostCard,Materaile],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
