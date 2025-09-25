import { Component, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule,MatIconModule,MarkdownModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
 
}
