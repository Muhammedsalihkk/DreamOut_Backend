import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { JwtService } from '../../infrastructure/security/jwt.service';
import { BadRequestError, NotFoundError } from '../../domain/errors/domain.error';

export class MomentsController {
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

  async getMoments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const moments = await prisma.moment.findMany({
        where: { visibility: 'Public' },
        include: {
          user: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Format to match frontend CreatedMoment structure
      const formatted = moments.map((m) => ({
        id: String(m.id),
        type: m.type as any,
        mediaUri: m.mediaUri,
        noteText: m.noteText,
        caption: m.caption || '',
        visibility: m.visibility,
        tags: Array.isArray(m.tags) ? m.tags : [],
        likesCount: m.likesCount,
        commentsCount: m.commentsCount,
        createdAt: m.createdAt.toISOString(),
        timeAgo: 'Recently',
        user: {
          id: String(m.user.id),
          name: m.user.name || 'Explorer',
          username: (m.user.name || 'explorer').toLowerCase().replace(/\s+/g, '_'),
          avatar: m.user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        },
      }));

      res.status(200).json({
        statusCode: 200,
        message: 'Moments feed retrieved successfully',
        data: formatted,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequestError('Invalid moment ID');

      const moment = await prisma.moment.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
      });

      if (!moment) throw new NotFoundError('Moment', id);

      res.status(200).json({
        statusCode: 200,
        message: 'Moment retrieved successfully',
        data: moment,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, mediaUri, noteText, caption, visibility, tags, routeId, spotId, addToStory } = req.body;
      const userId = this.extractUserId(req);

      const moment = await prisma.moment.create({
        data: {
          userId,
          type: type || 'photo',
          mediaUri: mediaUri || null,
          noteText: noteText || null,
          caption: caption || '',
          visibility: visibility || 'Public',
          tags: tags || [],
          routeId: routeId ? Number(routeId) : null,
          spotId: spotId ? Number(spotId) : null,
        },
        include: {
          user: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
      });

      // If user checked "addToStory", automatically publish to Story as well
      if (addToStory && (mediaUri || noteText)) {
        await prisma.story.create({
          data: {
            userId,
            title: caption ? caption.slice(0, 30) : 'Moment Story',
            image: mediaUri || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
            mediaUri: mediaUri || null,
            caption: caption || null,
            routeId: routeId ? Number(routeId) : null,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        }).catch(() => {});
      }

      res.status(201).json({
        statusCode: 201,
        message: 'Moment created successfully',
        data: moment,
      });
    } catch (error) {
      next(error);
    }
  }

  async like(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequestError('Invalid moment ID');

      const updated = await prisma.moment.update({
        where: { id },
        data: { likesCount: { increment: 1 } },
        include: {
          user: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
      });

      res.status(200).json({
        statusCode: 200,
        message: 'Moment liked successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequestError('Invalid moment ID');

      await prisma.moment.delete({ where: { id } });

      res.status(200).json({
        statusCode: 200,
        message: 'Moment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
