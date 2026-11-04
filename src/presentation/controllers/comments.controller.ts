import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { JwtService } from '../../infrastructure/security/jwt.service';
import { BadRequestError, NotFoundError } from '../../domain/errors/domain.error';

export class CommentsController {
  private extractUserId(req: Request): number | undefined {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = JwtService.verifyToken<{ userId: number }>(token);
        if (decoded && decoded.userId) return Number(decoded.userId);
      } catch {
        // Token invalid
      }
    }
    if ((req as any).user?.id) return Number((req as any).user.id);
    if (req.body.userId) return Number(req.body.userId);
    return undefined;
  }

  async findByRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const routeId = Number(req.params.routeId || req.params.id);
      if (isNaN(routeId)) throw new BadRequestError('Invalid route ID');

      const comments = await prisma.comment.findMany({
        where: { routeId },
        include: {
          user: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        statusCode: 200,
        message: 'Route comments fetched successfully',
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  }

  async findBySpot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const spotId = Number(req.params.spotId || req.params.id);
      if (isNaN(spotId)) throw new BadRequestError('Invalid spot ID');

      const comments = await prisma.comment.findMany({
        where: { spotId },
        include: {
          user: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        statusCode: 200,
        message: 'Spot comments fetched successfully',
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { text, routeId, spotId, parentId } = req.body;
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        throw new BadRequestError('Comment text is required');
      }

      let userId = this.extractUserId(req);
      if (!userId) {
        const firstUser = await prisma.user.findFirst({ select: { id: true } });
        userId = firstUser ? firstUser.id : 1;
      }

      const comment = await prisma.comment.create({
        data: {
          text: text.trim(),
          userId,
          routeId: routeId ? Number(routeId) : undefined,
          spotId: spotId ? Number(spotId) : undefined,
          parentId: parentId ? Number(parentId) : undefined,
        },
        include: {
          user: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
      });

      // Update comments count on Route if applicable
      if (routeId) {
        await prisma.route.update({
          where: { id: Number(routeId) },
          data: { commentsCount: { increment: 1 } },
        }).catch(() => {});
      }

      res.status(201).json({
        statusCode: 201,
        message: 'Comment posted successfully',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleLike(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequestError('Invalid comment ID');

      const existing = await prisma.comment.findUnique({ where: { id } });
      if (!existing) throw new NotFoundError('Comment', id);

      const updated = await prisma.comment.update({
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
        message: 'Comment liked successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequestError('Invalid comment ID');

      const existing = await prisma.comment.findUnique({ where: { id } });
      if (!existing) throw new NotFoundError('Comment', id);

      await prisma.comment.delete({ where: { id } });

      if (existing.routeId) {
        await prisma.route.update({
          where: { id: existing.routeId },
          data: { commentsCount: { decrement: 1 } },
        }).catch(() => {});
      }

      res.status(200).json({
        statusCode: 200,
        message: 'Comment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
