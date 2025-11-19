import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';
import * as Stomp from "stompjs"
import { apiUrl, token } from '../../../constant/constante';
import { JwtService } from '../../JWT/jwt-service';
import { NotificationResponse } from '../../../models/Notification/Notification';
import { ToastrService } from 'ngx-toastr';
import { NotificationServiceApi } from '../../servicesAPIREST/Notifications/notification-service';
import { AuthService } from '../../servicesAPIREST/auth/auth-service';
import { NotificationService } from '../../notificationAlert/NotificationService';

@Injectable({
  providedIn: 'root'
})
export class NotificationsServiceLogique {

  constructor(private jwt: JwtService,
    private toasterService: ToastrService,
    private notificationServices: NotificationServiceApi, private auth: AuthService,
    private notificationAlert: NotificationService
  ) { }

  private notificationsSubject = new BehaviorSubject<any>(null);
  notifications$ = this.notificationsSubject.asObservable();

  private notificationIconsSubject = new BehaviorSubject<boolean>(false);
  notificationIcons$ = this.notificationIconsSubject.asObservable();


  private notificationsSubscription: any;

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();


  private stompClient?: any = null;
  private wsUrl = `${apiUrl}ws`;
  notifications: NotificationResponse[] = [];

  loadingNotifications() {
    // const isAuthenticated = this.auth.isLoggedIn();
    // if (isAuthenticated) {}
    this.allNotifications()
    this.unreadNotificationCount()
  }

  unreadNotificationCount() {
    let numbers = this.notifications.filter(n => !n.read).length;
    this.notificationIconsSubject.next(numbers===0?false:true)
    this.unreadCountSubject.next(numbers)
  }
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.triggerUserId === id)
    if (notification) {
      notification.read = true
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
  }
  addNotification(notification: NotificationResponse): void {
    this.notifications.unshift(notification);
    this.unreadNotificationCount();
  }

  updateNotification(): void {
    this.notificationsSubject.next([...this.notifications])
    this.unreadNotificationCount();

  }
  allNotifications() {
    const isAuthApiCall = this.auth.isLoggedIn()
    if (!isAuthApiCall) { return }
    let data = this.notificationServices.getALLNotifications();
    data.subscribe({
      next: response => {
        // console.log(response,"notifications");
        this.notifications = response.data;
        this.notificationsSubject.next(this.notifications)

      }
    })
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
                const notifications: NotificationResponse = JSON.parse(message.body);
                this.notificationIconsSubject.next(true);
                if (notifications && notifications.triggerUserId != currentUserId) {
                  const newNotification: NotificationResponse = {
                    id: notifications.id,
                    triggerUserId: notifications.triggerUserId,
                    title: "New Notification",
                    message: notifications.message || 'You have a new notification',
                    createdAt: new Date().toLocaleTimeString(),
                    read: false,
                    type: notifications.type,
                    senderUsername: notifications.senderUsername
                  }
                  this.getNotificationMessage(notifications.type, notifications.message)

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

  getNotificationMessage(type: string, message: string) {
    switch (type) {
      case "FOLLOW":
        this.toasterService.info(message, type);
        break
      case "POST_LIKED":
        this.toasterService.info(message, type);
        break
      case "POST_COMMENTED":
        this.toasterService.info(message, type);
        break
      case "ADMIN_REPORT_POST":
        this.toasterService.info(message, type);
        break
      case "USER_BANNED":
        this.toasterService.warning(message, type);
        break
      case "NEW_POST":
        this.toasterService.info(message, "New Post");
        break
      default:
        'You have a new notification';
        break
    }
  }
  private showBrowserNotification(notification: NotificationResponse): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/assets/icons/notification-icon.png' // Add your icon path
      });
    }
  }
  disconnect() {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    if (this.stompClient) {
      this.stompClient.disconnect(() => console.log('❌ WebSocket disconnected'));
    }
  }

  getNotifications() {
    return this.notifications$;
  }
}
