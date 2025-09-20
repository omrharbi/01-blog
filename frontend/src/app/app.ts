import { Component, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule,MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
 
}
