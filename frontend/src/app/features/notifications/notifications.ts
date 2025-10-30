import { Component } from '@angular/core';
import { Materaile } from '../../modules/materaile-module';
import { NotificationsServiceLogique } from '../../core/service/serivecLogique/notifications/notifications-service-logique';
import { Subscription } from 'rxjs';
import { NotificationRequest, NotificationResponse } from '../../core/models/Notification/Notification';
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';
import { NotificationService } from '../../core/service/servicesAPIREST/Notifications/notification-service';

@Component({
  selector: 'app-notifications',
  imports: [Materaile, TimeAgoPipe],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class NotificationPopup {
  isOpen = false;
  notifications: NotificationResponse[] = []
  constructor(private notifLogique: NotificationsServiceLogique, private auth: AuthService, private notificationService: NotificationService) { }
  private subscriptions = new Subscription();
  unreadCount = 0;
  ngOnInit() {
    const isAuthenticated = this.auth.isLoggedIn();
    if (isAuthenticated) {
      this.notifLogique.loadingNotifications();
      this.subscriptions.add(
        this.notifLogique.notifications$.subscribe(notif => {
          this.notifications = notif
        })
      )
      this.subscriptions.add(
        this.notifLogique.unreadCount$.subscribe(count => {
          this.unreadCount = count
        })

      )
    }
  }

  togglePopup(): void {
    this.isOpen = !this.isOpen;
  }

  markAsRead(id: string): void {
    console.log(id);
    this.notificationService.readNotification(id).subscribe({
      next: reponse => {
        if (reponse) {
          const notification = this.notifications.find(n => n.id === id);
          console.log(notification);

          if (notification) {
            notification.read = true;
          }
        }
      }
    })

  }

  markAllAsRead(): void {
    // this.notifications.forEach(n => n.read = true);
  }
}
