export interface JourneyMoment {
  id: number;
  journeyId: number;
  spotId: string | null;
  spotName: string | null;
  type: string;
  mediaUrl: string | null;
  caption: string | null;
  visibility: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Journey {
  id: number;
  userId: number;
  routeId: number;
  status: string;
  currentSpotIndex: number;
  exploredSpots: any;
  totalDuration: string | null;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: number;
    name: string | null;
    email: string;
  };
  route?: any;
  moments?: JourneyMoment[];
}
