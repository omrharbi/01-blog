import { Component } from '@angular/core';
import { Materaile } from '../../modules/materaile-module';
import { NotificationsServiceLogique } from '../../core/service/serivecLogique/notifications/notifications-service-logique';
import { Subscription } from 'rxjs';
import { NotificationRequest, NotificationResponse } from '../../core/models/Notification/Notification';
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';
import { NotificationServiceApi } from '../../core/service/servicesAPIREST/Notifications/notification-service';

@Component({
  selector: 'app-notifications',
  imports: [Materaile, TimeAgoPipe],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class NotificationPopup {
  isOpen = false;
  notifications: NotificationResponse[] = []
  constructor(private notifLogique: NotificationsServiceLogique, private auth: AuthService, private notificationService: NotificationServiceApi) { }
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
    }
  }
 
  togglePopup(): void {
    this.isOpen = !this.isOpen;
  }

  markAsRead(id: string): void {
    
    let number =this.notifLogique.unreadNotificationCount()
    this.notifLogique.markAsRead(id);
   // this.notificationService.readNotification(id).subscribe({
    //   next: reponse => {
    //     if (reponse) {
    //       const notification = this.notifications.find(n => n.id === id);
    //       if (notification) {
    //         if (!notification.read) {
    //           notification.read = true;
    //         } else {
    //           notification.read = false;
    //         }
    //       }
    //     }
    //   }
    // })

  }

  markAllAsRead(): void {
    this.notifications.forEach(not => {
      this.notificationService.readNotification(not.id).subscribe({
        next: reponse => {
          if (reponse) {
            const notification = this.notifications.find(n => n.id === not.id);
            if (notification) {
              notification.read = true;
            }
          }
        }
      })
    });
  }
}
