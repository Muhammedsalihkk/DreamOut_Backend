export interface Spot {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  image: string | null;
  location: string | null;
  latitude: number;
  longitude: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
