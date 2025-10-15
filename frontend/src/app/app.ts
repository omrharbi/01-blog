import { Component, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';
import { AuthService } from './core/service/servicesAPIREST/auth/auth-service';
import { MatDialogModule } from '@angular/material/dialog';
  
@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule,MatIconModule,MarkdownModule,MatDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  
})
export class App {
 constructor(private authService: AuthService) {}

  ngOnInit() {
     this.authService.isLoggedIn();
  }
}
