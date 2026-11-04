import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { JwtService } from '../../infrastructure/security/jwt.service';
import { BadRequestError, NotFoundError } from '../../domain/errors/domain.error';

export class StoriesController {
  private extractUserId(req: Request): number {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = JwtService.verifyToken<{ userId: number }>(token);
        if (decoded && decoded.userId) return Number(decoded.userId);
      } catch {
        // Fallback
      }
    }
    if ((req as any).user?.id) return Number((req as any).user.id);
    if (req.body.userId) return Number(req.body.userId);
    return 1;
  }

  async getStories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = this.extractUserId(req);

      const stories = await prisma.story.findMany({
        include: {
          user: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Format into frontend Story structure grouped by user
      const formattedStories = stories.map((s) => ({
        id: String(s.id),
        title: s.title || (s.user?.name ? `${s.user.name}'s Story` : 'Story'),
        image: s.image || s.mediaUri || s.user?.avatar || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        isUserStory: s.userId === currentUserId,
        hasUnseen: true,
        user: {
          id: String(s.user.id),
          name: s.user.name || 'Explorer',
          username: (s.user.name || 'explorer').toLowerCase().replace(/\s+/g, '_'),
          avatar: s.user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        },
        segments: [
          {
            id: `seg-${s.id}`,
            type: s.type || 'image',
            mediaUri: s.mediaUri || s.image,
            caption: s.caption || '',
            duration: 5,
          },
        ],
      }));

      res.status(200).json({
        statusCode: 200,
        message: 'Stories retrieved successfully',
        data: formattedStories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequestError('Invalid story ID');

      const story = await prisma.story.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
      });

      if (!story) throw new NotFoundError('Story', id);

      res.status(200).json({
        statusCode: 200,
        message: 'Story retrieved successfully',
        data: story,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, image, mediaUri, type, caption, routeId } = req.body;
      if (!image && !mediaUri) {
        throw new BadRequestError('Image or media URI is required for a story');
      }

      const userId = this.extractUserId(req);

      const story = await prisma.story.create({
        data: {
          userId,
          title: title || 'New Story',
          image: image || mediaUri,
          mediaUri: mediaUri || image,
          type: type || 'image',
          caption: caption || null,
          routeId: routeId ? Number(routeId) : null,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
        include: {
          user: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
      });

      res.status(201).json({
        statusCode: 201,
        message: 'Story created successfully',
        data: story,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequestError('Invalid story ID');

      await prisma.story.delete({ where: { id } });

      res.status(200).json({
        statusCode: 200,
        message: 'Story deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
