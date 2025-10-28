import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';
import { AuthService } from './core/service/servicesAPIREST/auth/auth-service';
import { MatDialogModule } from '@angular/material/dialog';
import { provideToastr, ToastrModule, ToastrService } from 'ngx-toastr';
import { NotificationsServiceLogique } from './core/service/serivecLogique/notifications/notifications-service-logique';
import { Subscription } from 'rxjs';
import { Global } from './core/service/serivecLogique/globalEvent/global';
import { NotificationPopup } from './features/notifications/notifications';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    MatSlideToggleModule, MatIconModule, MarkdownModule, MatDialogModule,NotificationPopup,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',

})
export class App implements OnInit, OnDestroy {
  constructor(private global: Global, private authService: AuthService, private toastr: ToastrService, private notificationService: NotificationsServiceLogique) { }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  isNotificated = false;
  private subscription = new Subscription();
  ngOnInit() {
    this.subscription = this.global.sharedData.subscribe((event) => {
      // console.log(event,"*******************************");
      if (event.type === "notification") {
        this.isNotificated = event.data;
      }
    });
    this.notificationService.connect();
    this.authService.isLoggedIn();
  }
}
