import { PrismaClient } from '@prisma/client';
import {
  AddJourneyMomentData,
  CompleteJourneyData,
  IJourneyRepository,
  StartJourneyData,
  UpdateJourneyProgressData,
} from '../../../domain/repositories/journey.repository';
import { Journey, JourneyMoment } from '../../../domain/entities/journey.entity';

export class PrismaJourneyRepository implements IJourneyRepository {
  constructor(private prisma: PrismaClient) {}

  private get journeyClient(): any {
    return (this.prisma as any).journey;
  }

  private get momentClient(): any {
    return (this.prisma as any).journeyMoment;
  }

  private mapMoment(moment: any): JourneyMoment {
    return {
      id: moment.id,
      journeyId: moment.journeyId,
      spotId: moment.spotId ?? null,
      spotName: moment.spotName ?? null,
      type: moment.type,
      mediaUrl: moment.mediaUrl ?? null,
      caption: moment.caption ?? null,
      visibility: moment.visibility,
      createdAt: moment.createdAt,
      updatedAt: moment.updatedAt,
    };
  }

  private mapJourney(journey: any): Journey {
    return {
      id: journey.id,
      userId: journey.userId,
      routeId: journey.routeId,
      status: journey.status,
      currentSpotIndex: journey.currentSpotIndex ?? 0,
      exploredSpots: journey.exploredSpots ?? [],
      totalDuration: journey.totalDuration ?? null,
      startedAt: journey.startedAt,
      completedAt: journey.completedAt ?? null,
      createdAt: journey.createdAt,
      updatedAt: journey.updatedAt,
      user: journey.user
        ? {
            id: journey.user.id,
            name: journey.user.name,
            email: journey.user.email,
          }
        : undefined,
      route: journey.route ?? undefined,
      moments: Array.isArray(journey.moments) ? journey.moments.map((m: any) => this.mapMoment(m)) : [],
    };
  }

  async findActiveByUserAndRoute(userId: number, routeId: number): Promise<Journey | null> {
    const journey = await this.journeyClient.findFirst({
      where: {
        userId,
        routeId,
        status: 'IN_PROGRESS',
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        route: true,
        moments: { orderBy: { createdAt: 'asc' } },
      },
    });
    return journey ? this.mapJourney(journey) : null;
  }

  async start(data: StartJourneyData): Promise<Journey> {
    const created = await this.journeyClient.create({
      data: {
        userId: data.userId,
        routeId: data.routeId,
        status: 'IN_PROGRESS',
        currentSpotIndex: 0,
        exploredSpots: [0],
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        route: true,
        moments: true,
      },
    });
    return this.mapJourney(created);
  }

  async updateProgress(id: number, data: UpdateJourneyProgressData): Promise<Journey> {
    const updated = await this.journeyClient.update({
      where: { id },
      data: {
        currentSpotIndex: data.currentSpotIndex,
        exploredSpots: data.exploredSpots,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        route: true,
        moments: { orderBy: { createdAt: 'asc' } },
      },
    });
    return this.mapJourney(updated);
  }

  async addMoment(journeyId: number, data: AddJourneyMomentData): Promise<JourneyMoment> {
    const created = await this.momentClient.create({
      data: {
        journeyId,
        spotId: data.spotId ?? null,
        spotName: data.spotName ?? null,
        type: data.type || 'photo',
        mediaUrl: data.mediaUrl ?? null,
        caption: data.caption ?? null,
        visibility: data.visibility || 'public',
      },
    });
    return this.mapMoment(created);
  }

  async complete(id: number, data: CompleteJourneyData): Promise<Journey> {
    const updated = await this.journeyClient.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        ...(data.totalDuration ? { totalDuration: data.totalDuration } : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        route: true,
        moments: { orderBy: { createdAt: 'asc' } },
      },
    });
    return this.mapJourney(updated);
  }

  async findById(id: number): Promise<Journey | null> {
    const journey = await this.journeyClient.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        route: true,
        moments: { orderBy: { createdAt: 'asc' } },
      },
    });
    return journey ? this.mapJourney(journey) : null;
  }

  async findAllByUser(userId: number): Promise<Journey[]> {
    const journeys = await this.journeyClient.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        route: true,
        moments: { orderBy: { createdAt: 'asc' } },
      },
    });
    return journeys.map((j: any) => this.mapJourney(j));
  }
}
