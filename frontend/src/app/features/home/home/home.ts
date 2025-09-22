import { Component } from '@angular/core';
import { CardShare } from '../card-share/card-share';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardShare],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
