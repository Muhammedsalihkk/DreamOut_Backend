import { PrismaClient } from '@prisma/client';
import {
  CreateRouteData,
  IRouteRepository,
  UpdateRouteData,
} from '../../../domain/repositories/route.repository';
import { Route } from '../../../domain/entities/route.entity';

export class PrismaRouteRepository implements IRouteRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(route: any): Route {
    return {
      id: route.id,
      userId: route.userId,
      title: route.title,
      coverImage: route.coverImage ?? null,
      shortDescription: route.shortDescription ?? null,
      description: route.description ?? null,
      location: route.location ?? null,
      category: route.category,
      difficulty: route.difficulty,
      visibility: route.visibility,
      distance: route.distance ?? null,
      duration: route.duration ?? null,
      places: route.places ?? [],
      highlights: route.highlights ?? [],
      likesCount: route.likesCount,
      commentsCount: route.commentsCount,
      createdAt: route.createdAt,
      updatedAt: route.updatedAt,
      user: route.user
        ? {
            id: route.user.id,
            name: route.user.name,
            email: route.user.email,
          }
        : undefined,
    };
  }

  async create(data: CreateRouteData): Promise<Route> {
    const created = await this.prisma.route.create({
      data: {
        userId: data.userId,
        title: data.title,
        coverImage: data.coverImage,
        shortDescription: data.shortDescription,
        description: data.description,
        location: data.location,
        category: data.category,
        difficulty: data.difficulty ?? 'Moderate',
        visibility: data.visibility ?? 'Public',
        distance: data.distance,
        duration: data.duration,
        places: data.places,
        highlights: data.highlights,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return this.mapToEntity(created);
  }

  async findAll(): Promise<Route[]> {
    const routes = await this.prisma.route.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return routes.map((r) => this.mapToEntity(r));
  }

  async findById(id: number): Promise<Route | null> {
    const route = await this.prisma.route.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return route ? this.mapToEntity(route) : null;
  }

  async update(id: number, data: UpdateRouteData): Promise<Route> {
    const updated = await this.prisma.route.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.difficulty !== undefined && { difficulty: data.difficulty }),
        ...(data.visibility !== undefined && { visibility: data.visibility }),
        ...(data.distance !== undefined && { distance: data.distance }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.places !== undefined && { places: data.places }),
        ...(data.highlights !== undefined && { highlights: data.highlights }),
        ...(data.likesCount !== undefined && { likesCount: data.likesCount }),
        ...(data.commentsCount !== undefined && { commentsCount: data.commentsCount }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: number): Promise<Route> {
    const deleted = await this.prisma.route.delete({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return this.mapToEntity(deleted);
  }
}
