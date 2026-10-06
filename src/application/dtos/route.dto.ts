export interface CreateRouteDTO {
  userId?: number;
  title: string;
  coverImage?: string;
  shortDescription?: string;
  description?: string;
  location?: string;
  category: string;
  difficulty?: string;
  visibility?: string;
  distance?: string;
  duration?: string;
  places?: any;
  highlights?: any;
}

export interface UpdateRouteDTO {
  title?: string;
  coverImage?: string;
  shortDescription?: string;
  description?: string;
  location?: string;
  category?: string;
  difficulty?: string;
  visibility?: string;
  distance?: string;
  duration?: string;
  places?: any;
  highlights?: any;
  likesCount?: number;
  commentsCount?: number;
}

export interface RouteResponseDTO {
  id: number;
  userId: number;
  title: string;
  coverImage: string | null;
  shortDescription: string | null;
  description: string | null;
  location: string | null;
  category: string;
  difficulty: string;
  visibility: string;
  distance: string | null;
  duration: string | null;
  places: any;
  highlights: any;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: number;
    name: string | null;
    email: string;
  };
}
