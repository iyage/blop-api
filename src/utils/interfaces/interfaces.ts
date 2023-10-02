export interface response {
  status: number;
  data: object | null | string;
  message: string;
}

export interface post {
  id: number;
  userId: number;
  content: string;
}

export interface user {
  id: number;
  firstName: string;
  lastName: string;
  password?: string;
  email: string;
  posts?: post[];
}
