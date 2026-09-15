export interface User {
  id: number;
  email: string;
  name: string | null;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

