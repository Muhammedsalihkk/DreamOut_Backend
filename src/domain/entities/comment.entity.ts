export interface Comment {
  id: number;
  userId: number;
  routeId?: number | null;
  spotId?: number | null;
  parentId?: number | null;
  text: string;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: number;
    name: string | null;
    avatar?: string | null;
    email: string;
  };
}

