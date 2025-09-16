import { Component, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  //  constructor(public themeService: ThemeService){
    
  //  }
}
