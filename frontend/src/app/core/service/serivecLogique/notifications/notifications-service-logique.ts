import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../../../models/Notification/Notification';


@Injectable({
  providedIn: 'root'
})
export class NotificationsServiceLogique {
  private notificationsSubject = new BehaviorSubject<any>(null);
  notifications$ = this.notificationsSubject.asObservable();
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  notifications: Notification[] = [
    {
      id: 1,
      title: 'New message received',
      message: 'You have a new message from John Doe',
      time: '5 min ago',
      read: false
    },
    {
      id: 2,
      title: 'Payment successful',
      message: 'Your payment of $99.99 has been processed',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'Update available',
      message: 'A new version of the app is ready to install',
      time: '2 hours ago',
      read: true
    },
    {
      id: 4,
      title: 'Task completed',
      message: 'Your export task has finished successfully',
      time: '1 day ago',
      read: true
    },
    {
      id: 5,
      title: 'Welcome!',
      message: 'Thanks for joining our platform',
      time: '2 days ago',
      read: true
    }
  ];

  loadingNotifications() {
    this.allNotifications()
    this.unreadNotificationCount()
  }
  allNotifications() {
    this.notificationsSubject.next(this.notifications)
  }
  unreadNotificationCount() {
    let numbers = this.notifications.filter(n => !n.read).length;

    this.unreadCountSubject.next(numbers)

  }
  markAsRead(id: number): void {
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
  }

}
