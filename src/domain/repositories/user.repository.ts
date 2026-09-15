import { User } from '../entities/user.entity';

export interface CreateUserData {
  email: string;
  name?: string;
  password?: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: number, data: UpdateUserData): Promise<User>;
  delete(id: number): Promise<User>;
}
