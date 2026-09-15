import { PrismaClient } from '@prisma/client';
import { User } from '../../../domain/entities/user.entity';
import {
  CreateUserData,
  IUserRepository,
  UpdateUserData,
} from '../../../domain/repositories/user.repository';

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password || '',
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
 
  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, data: UpdateUserData): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
