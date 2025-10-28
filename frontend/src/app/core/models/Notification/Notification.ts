export interface NotificationRequest {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: string;
  sender?: string;
}

interface StompMessage {
  body: string;
  headers?: Record<string, string>;
}