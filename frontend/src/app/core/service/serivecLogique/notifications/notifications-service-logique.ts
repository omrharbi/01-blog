import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';
import * as Stomp from "stompjs"
import { apiUrl, LocalstorageKey, token } from '../../../constant/constante';
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
    private notificationServices: NotificationServiceApi,
  ) { }

  private notificationsSubject = new BehaviorSubject<any>(null);
  notifications$ = this.notificationsSubject.asObservable();

  private notificationIconsSubject = new BehaviorSubject<boolean>(false);
  notificationIcons$ = this.notificationIconsSubject.asObservable();


  private notificationsSubscription: any;

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();


  private stompClient: any;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private wsUrl = `${apiUrl}ws`;
  notifications: NotificationResponse[] = [];

  loadingNotifications() {
    this.allNotifications()
    this.unreadNotificationCount()
  }
  unreadNotificationCount(): number {
    let numbers = this.notifications.filter(n => !n.read).length;
    return numbers
  }
  markAsRead(id: string): void {
    this.notificationServices.readNotification(id).subscribe({
      next: reponse => {
        if (reponse) {
          const notification = this.notifications.find(n => n.id === id);

          if (notification) {
            if (!notification.read) {
              let number = this.unreadNotificationCount() - 1;
              this.notificationIconsSubject.next(number !== 0)
              notification.read = true;
            } else {
              let number = this.unreadNotificationCount() + 1;
              this.notificationIconsSubject.next(number !== 0)
              notification.read = false;
            }
          }
        }
      }
    })
  }


  allNotifications() {
    // const isAuthApiCall = this.auth.isLoggedIn()
    // if (!isAuthApiCall) { return }
    let data = this.notificationServices.getALLNotifications();
    data.subscribe({
      next: response => {
        this.notifications = response.data;

        this.notificationIconsSubject.next(this.unreadNotificationCount() !== 0)
        this.notificationsSubject.next(this.notifications)

      }
    })
  }
  connect(): void {
    const token = localStorage.getItem(LocalstorageKey.token);

    if (!token) {
      console.log('⚠️ No token available, skipping WebSocket connection');
      return;
    }

    // Don't reconnect if already connected
    if (this.stompClient?.connected) {
      console.log('✅ WebSocket already connected');
      return;
    }

    try {

      const currentUserId = this.jwt.getUUIDFromToken(token); // Replace with actual user ID
      if (!currentUserId) {
        console.error('❌ Could not extract user ID from token');
        return;
      }
      console.log('🔌 Connecting to WebSocket...');
      const socket = new SockJS(this.wsUrl);
      this.stompClient = Stomp.over(socket)

      if (token) {

        this.stompClient.debug = null;


        this.stompClient.connect({ 'Authorization': `Bearer ${token}` },
          (frame: any) => {
            this.reconnectAttempts = 0;
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
    } catch (error) {

    }
  }

  getNotificationMessage(type: string, message: string) {
    switch (type) {
      case "FOLLOW":
        this.toasterService.info(message, type);
        break
      case "POST_LIKED":
        this.toasterService.info(message, "POST LIKED");
        break
      case "POST_COMMENTED":
        this.toasterService.info(message, type);
        break
      case "ADMIN_REPORT_POST":
        this.toasterService.info(message, type);
        break
      case "USER_BANNED":
        this.toasterService.warning(message, "USER BANNED");
        break
      case "NEW_POST":
        this.toasterService.info(message, "New Post");
        break
      default:
        'You have a new notification';
        break
    }
  }

  disconnect() {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
      this.notificationsSubscription = null;
    }

    if (this.stompClient?.connected) {
      this.stompClient.disconnect(() => {
        console.log('🔌 WebSocket disconnected');
      });
    }

    this.stompClient = null;
    this.reconnectAttempts = 0;
  }
 
  getNotifications() {
    return this.notifications$;
  }
}
