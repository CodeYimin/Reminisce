export interface User {
  id: string;
  username: string;
}

export interface Message {
  owner: {
    user: {
      id: string;
      username: string;
    };
  };
  id: string;
  createdAt: Date;
  content: string;
}

export interface NotificationUser {
  longitude: number | null;
  latitude: number | null;
  user: {
    id: string;
    username: string;
  };
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
  recipients: NotificationUser[];
}
