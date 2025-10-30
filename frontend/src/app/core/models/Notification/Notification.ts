export interface NotificationRequest {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: string;
  sender?: string;
}
export interface NotificationResponse {
  id: string,
  triggerUserId: string,
  title: string,
  type: string,
  message: string,
  read: boolean,
  senderUsername: string,
  senderAvatar?: string,
  createdAt: string,
}
interface StompMessage {
  body: string;
  headers?: Record<string, string>;
}