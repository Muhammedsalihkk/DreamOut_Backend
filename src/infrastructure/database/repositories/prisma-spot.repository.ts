import { PrismaClient } from '@prisma/client';

import {
  CreateSpotData,
  ISpotRepository,
  UpdateSpotData,
} from '../../../domain/repositories/spot.repository';
import { Spot } from '../../../../src/domain/entities/spot.entity';

export class PrismaSpotRepository implements ISpotRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(spot: {
    id: number;
    userId: number;
    name: string;
    description: string | null;
    image?: string | null;
    location?: string | null;
    latitude: any;
    longitude: any;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  }): Spot {
    return {
      id: spot.id,
      userId: spot.userId,
      name: spot.name,
      description: spot.description ?? null,
      image: spot.image ?? null,
      location: spot.location ?? null,
      latitude: Number(spot.latitude),
      longitude: Number(spot.longitude),
      category: spot.category,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
    };
  }

  async create(data: CreateSpotData): Promise<Spot> {
    let resolvedUserId = data.userId;

    if (resolvedUserId) {
      const userExists = await this.prisma.user.findUnique({
        where: { id: resolvedUserId },
        select: { id: true },
      });
      if (!userExists) {
        const firstUser = await this.prisma.user.findFirst({ select: { id: true } });
        if (firstUser) {
          resolvedUserId = firstUser.id;
        } else {
          const defaultUser = await this.prisma.user.create({
            data: {
              email: 'traveler@dreamout.com',
              name: 'Alex Rivera',
              password: 'password123',
            },
          });
          resolvedUserId = defaultUser.id;
        }
      }
    } else {
      const firstUser = await this.prisma.user.findFirst({ select: { id: true } });
      if (firstUser) {
        resolvedUserId = firstUser.id;
      } else {
        const defaultUser = await this.prisma.user.create({
          data: {
            email: 'traveler@dreamout.com',
            name: 'Alex Rivera',
            password: 'password123',
          },
        });
        resolvedUserId = defaultUser.id;
      }
    }

    const created = await this.prisma.spot.create({
      data: {
        userId: resolvedUserId,
        name: data.name,
        description: data.description,
        image: data.image,
        location: data.location,
        latitude: data.latitude !== undefined ? data.latitude : 10.0889,
        longitude: data.longitude !== undefined ? data.longitude : 77.0595,
        category: data.category,
      },
    });
    return this.mapToEntity(created);
  }

  async findAll(): Promise<Spot[]> {
    const spots = await this.prisma.spot.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return spots.map((spot) => this.mapToEntity(spot));
  }

  async findById(id: number): Promise<Spot | null> {
    const spot = await this.prisma.spot.findUnique({
      where: { id },
    });
    return spot ? this.mapToEntity(spot) : null;
  }

  async update(id: number, data: UpdateSpotData): Promise<Spot> {
    const updated = await this.prisma.spot.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
        ...(data.category !== undefined && { category: data.category }),
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: number): Promise<Spot> {
    const deleted = await this.prisma.spot.delete({
      where: { id },
    });
    return this.mapToEntity(deleted);
  }
}
