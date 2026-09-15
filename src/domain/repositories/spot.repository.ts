import { Spot } from '../entities/spot.entity';

export interface CreateSpotData {
  userId: number;
  name: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  category: string;
}

export interface UpdateSpotData {
  name?: string;
  description?: string | null;
  latitude?: number;
  longitude?: number;
  category?: string;
}

export interface ISpotRepository {
  create(data: CreateSpotData): Promise<Spot>;
  findAll(): Promise<Spot[]>;
  findById(id: number): Promise<Spot | null>;
  update(id: number, data: UpdateSpotData): Promise<Spot>;
  delete(id: number): Promise<Spot>;
}
