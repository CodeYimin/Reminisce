export interface User {
  id: string;
  username: string;
}

export interface Message {
  owner: {
    id: string;
    username: string;
    password: string;
  };
  id: string;
  ownerId: string;
  notificationId: string;
  content: string;
  createdAt: string;
}

export interface INotification {
  id: string;
  photo?: {
    id: string;
    timeCreated: Date;
    location: string;
    data: string;
    ownerId: string;
  };
  messages: Message[];
  recipients: User[];
}
