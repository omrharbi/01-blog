export interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

interface StompMessage {
  body: string;
  headers?: Record<string, string>;
}