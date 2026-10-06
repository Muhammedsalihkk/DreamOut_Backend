import { Route } from '../entities/route.entity';

export interface CreateRouteData {
  userId: number;
  title: string;
  coverImage?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  location?: string | null;
  category: string;
  difficulty?: string;
  visibility?: string;
  distance?: string | null;
  duration?: string | null;
  places?: any;
  highlights?: any;
}

export interface UpdateRouteData {
  title?: string;
  coverImage?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  location?: string | null;
  category?: string;
  difficulty?: string;
  visibility?: string;
  distance?: string | null;
  duration?: string | null;
  places?: any;
  highlights?: any;
  likesCount?: number;
  commentsCount?: number;
}

export interface IRouteRepository {
  create(data: CreateRouteData): Promise<Route>;
  findAll(): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
  update(id: number, data: UpdateRouteData): Promise<Route>;
  delete(id: number): Promise<Route>;
}
