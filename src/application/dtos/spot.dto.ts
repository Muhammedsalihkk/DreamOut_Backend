export interface CreateSpotDTO {
  userId?: number;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  category: string;
}

export interface UpdateSpotDTO {
  name?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
}

export interface SpotResponseDTO {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
