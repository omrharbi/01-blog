import { Component, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './modules/services/theme-service';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { Sidebar } from './shared/components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule,Header,Footer,Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
 
}
