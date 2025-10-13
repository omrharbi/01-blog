import { Component, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule,MatIconModule,MarkdownModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true  // This makes it work for ALL HTTP requests
    }
  ]
})
export class App {
 
}
