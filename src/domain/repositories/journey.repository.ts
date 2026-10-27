import { Journey, JourneyMoment } from '../entities/journey.entity';

export interface StartJourneyData {
  userId: number;
  routeId: number;
}

export interface UpdateJourneyProgressData {
  currentSpotIndex: number;
  exploredSpots: any;
}

export interface AddJourneyMomentData {
  spotId?: string;
  spotName?: string;
  type: string;
  mediaUrl?: string;
  caption?: string;
  visibility?: string;
}

export interface CompleteJourneyData {
  totalDuration?: string;
}

export interface IJourneyRepository {
  findActiveByUserAndRoute(userId: number, routeId: number): Promise<Journey | null>;
  start(data: StartJourneyData): Promise<Journey>;
  updateProgress(id: number, data: UpdateJourneyProgressData): Promise<Journey>;
  addMoment(journeyId: number, data: AddJourneyMomentData): Promise<JourneyMoment>;
  complete(id: number, data: CompleteJourneyData): Promise<Journey>;
  findById(id: number): Promise<Journey | null>;
  findAllByUser(userId: number): Promise<Journey[]>;
}
