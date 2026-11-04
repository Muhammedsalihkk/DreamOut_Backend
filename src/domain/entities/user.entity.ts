export interface User {
  id: number;
  email: string;
  name: string | null;
  password: string;
  avatar?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

