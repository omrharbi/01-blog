import { Component } from '@angular/core';
import { Notification } from '../../core/models/Notification/Notification';
import { Materaile } from '../../modules/materaile-module';
import { NotificationsServiceLogique } from '../../core/service/serivecLogique/notifications/notifications-service-logique';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  imports: [Materaile],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class NotificationPopup {
  isOpen = false;
  notifications: Notification[] = []
  constructor(private notifLogique: NotificationsServiceLogique) { }
  private subscriptions = new Subscription();
  unreadCount = 0;
  ngOnInit() {
    
    this.notifLogique.loadingNotifications();
    this.subscriptions.add(
      this.notifLogique.notifications$.subscribe(notif => {


        this.notifications = notif
      })
    )
    this.subscriptions.add(
      this.notifLogique.unreadCount$.subscribe(count => {
        console.log(count, "notiificatin");
        this.unreadCount = count
      })

    )
  }

  togglePopup(): void {
    this.isOpen = !this.isOpen;
  }

  markAsRead(id: number): void {
    // const notification = this.notifications.find(n => n.id === id);
    // if (notification) {
    //   notification.read = true;
    // }
  }

  markAllAsRead(): void {
    // this.notifications.forEach(n => n.read = true);
  }
}
