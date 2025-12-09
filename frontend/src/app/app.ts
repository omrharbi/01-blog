import { AfterViewInit, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterOutlet, NavigationError } from '@angular/router';
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
  imports: [
    RouterOutlet,
    MatSlideToggleModule,
    MatIconModule,
    MarkdownModule,
    MatDialogModule,
    NotificationPopup,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  isRendred: boolean;
  isNotificated = false;
  private subscription = new Subscription();

  constructor(
    private global: Global,
    private authService: AuthService,
    private toastr: ToastrService,
    private notificationService: NotificationsServiceLogique,
    private router: Router
  ) {
    this.isRendred = false;
  }

  ngOnInit() {
    // Existing subscriptions
    this.subscription = this.global.sharedData.subscribe((event) => {
      if (event.type === 'notification') {
        this.isNotificated = event.data;
      }
    });

    this.subscription.add(
      this.authService.isAuthenticated$.subscribe((isAuth) => {
        if (isAuth) {
          this.notificationService.connect();
        } else {
          this.notificationService.disconnect();
        }
      })
    );

    this.authService.isLoggedIn();

    // ✅ NavigationError handling (safe redirect)
    this.subscription.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationError) {
          console.error('Navigation error:', event.error);

          // Prevent infinite redirect loops
          if (this.router.url !== '/home') {
            this.router.navigate(['/home']);
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.notificationService.disconnect();
  }
}
