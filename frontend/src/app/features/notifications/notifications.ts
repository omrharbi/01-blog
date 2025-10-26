import { Component } from '@angular/core';
import { Notification } from '../../core/models/Notification/Notification';
import { Materaile } from '../../modules/materaile-module';

@Component({
  selector: 'app-notifications',
  imports: [Materaile],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class NotificationPopup  {
  isOpen = false;
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

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  togglePopup(): void {
    this.isOpen = !this.isOpen;
  }

  markAsRead(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }
}
