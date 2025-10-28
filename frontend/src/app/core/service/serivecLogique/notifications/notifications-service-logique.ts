import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { Notification } from '../../../models/Notification/Notification';
import SockJS from 'sockjs-client';
import * as Stomp from "stompjs"
import { apiUrl, token } from '../../../constant/constante';
import { JwtService } from '../../JWT/jwt-service';
import { Title } from '@angular/platform-browser';
import { NotificationRequest } from '../../../models/Notification/Notification';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class NotificationsServiceLogique {

  constructor(private jwt: JwtService,
    private toasterService: ToastrService) { }
  private notificationsSubject = new BehaviorSubject<any>(null);
  notifications$ = this.notificationsSubject.asObservable();
  private notificationsSubscription: any;

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();
  private stompClient?: any = null;
  private wsUrl = `${apiUrl}ws`;
  notifications: NotificationRequest[] = [
    {
      id: "1",
      title: 'New message received',
      message: 'You have a new message from John Doe',
      time: '5 min ago',
      read: false
    },
    {
      id: "2",
      title: 'Payment successful',
      message: 'Your payment of $99.99 has been processed',
      time: '1 hour ago',
      read: false
    },
    {
      id: "3",
      title: 'Update available',
      message: 'A new version of the app is ready to install',
      time: '2 hours ago',
      read: true
    },
    {
      id: "4",
      title: 'Task completed',
      message: 'Your export task has finished successfully',
      time: '1 day ago',
      read: true
    },
    {
      id: "5",
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
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
  }
  addNotification(notification: NotificationRequest): void {
    this.notifications.unshift(notification);
    this.unreadNotificationCount();
  }

  updateNotification(): void {
    this.notificationsSubject.next([...this.notifications])
    this.unreadNotificationCount();

  }
  connect(): void {
    const socket = new SockJS(this.wsUrl);
    this.stompClient = Stomp.over(socket)
    this.stompClient.debug = (str: string) => {
      console.log('🔍 STOMP:', str);
    };
    if (token) {

      const currentUserId = this.jwt.getUUIDFromToken(token); // Replace with actual user ID

      this.stompClient.connect({ 'Authorization': `Bearer ${token}` },
        (frame: any) => {
          this.notificationsSubscription = this.stompClient.subscribe(
            `/topic/user.${currentUserId}.notification`,
            (message: any) => {
              try {
                const notifications: NotificationRequest = JSON.parse(message.body);
                if (notifications) {
                  const newNotification: NotificationRequest = {
                    id: notifications.id,
                    title: "New Notification",
                    message: notifications.message || 'You have a new notification',
                    time: new Date().toLocaleTimeString(),
                    read: false,
                    type: notifications.type,
                    sender: notifications.sender
                  }
                  this.toasterService.info(notifications.message, notifications.type)
                  this.addNotification(newNotification);
                  this.showBrowserNotification(newNotification);
                }
              } catch (e) {
                console.log('📨 Message is not JSON:', message.body);
              }
            }
          )
            , (error: any) => {
              console.error('❌ WebSocket error:', error);
            }
        }

      )
    }
  }

  getNotificationMessage(type: string, message: string): string {
    switch (type) {
      case "FOLLOW":
        return message
      case "NEW_POST":
        return message
      case "POST_LIKED":
        return message
      case "POST_COMMENTED":
        return message
      case "ADMIN_REPORT_POST":
        return message
      case "ADMIN_REPORT_USER":
        return message
      case "ADMIN_WARNING":
        return message
      default:
        return 'You have a new notification';
     }
  }
  private showBrowserNotification(notification: NotificationRequest): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/assets/icons/notification-icon.png' // Add your icon path
      });
    }
  }
  disconnect(): void {
    // if (this.stompClient && this.stompClient.connected) {
    //   this.stompClient.deactivate();
    //   console.log('🔌 Disconnected');
    // }
  }

  getNotifications() {
    return this.notifications$;
  }
}
