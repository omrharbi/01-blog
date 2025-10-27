import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';
import { AuthService } from './core/service/servicesAPIREST/auth/auth-service';
import { MatDialogModule } from '@angular/material/dialog';
import { provideToastr, ToastrModule, ToastrService } from 'ngx-toastr';
import { NotificationsServiceLogique } from './core/service/serivecLogique/notifications/notifications-service-logique';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    MatSlideToggleModule, MatIconModule, MarkdownModule, MatDialogModule,

  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',

})
export class App   implements OnInit, OnDestroy{
  constructor(private authService: AuthService, private toastr: ToastrService, private notificationService: NotificationsServiceLogique) { }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }


  ngOnInit() {
    this.notificationService.connect();
    this.authService.isLoggedIn();
  }
}
