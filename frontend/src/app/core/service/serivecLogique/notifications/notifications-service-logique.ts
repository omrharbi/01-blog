import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../../../models/Notification/Notification';
import SockJS from 'sockjs-client';
import * as Stomp from "stompjs"
import { token } from '../../../constant/constante';
import { JwtService } from '../../JWT/jwt-service';
@Injectable({
  providedIn: 'root'
})
export class NotificationsServiceLogique {

  constructor(private jwt: JwtService) { }
  private notificationsSubject = new BehaviorSubject<any>(null);
  notifications$ = this.notificationsSubject.asObservable();
  private notificationsSubscription: any;

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
  private stompClient?: any = null;
  private wsUrl = 'http://localhost:9090/ws';
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
          console.log('✅ WebSocket connected:', frame);
          console.log('✅ WebSocket connected!');
          console.log('👤 Frame headers:', frame.headers);
          console.log('👤 Authenticated user:', frame.headers); //

          this.notificationsSubscription = this.stompClient.subscribe(
            `/topic/user.${currentUserId}.notification`,
            (message: any) => {
              //  console.log('📨 ===== MESSAGE RECEIVED =====');
              // console.log('📨 Raw message:', message);
              // console.log('📨 Message body:', message.body);
              // try {
              //   const notification = JSON.parse(message.body);
              //   console.log('📨 Parsed notification:', notification);
              // } catch (e) {
              //   console.log('📨 Message is not JSON:', message.body);
              // }
            }
          )
            , (error: any) => {
              console.error('❌ WebSocket error:', error);
            }
        }

      )
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
