import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { JwtService } from '../../infrastructure/security/jwt.service';
import { BadRequestError } from '../../domain/errors/domain.error';

export class NotificationsController {
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
    if (req.query.userId) return Number(req.query.userId);
    return 1;
  }

  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const category = req.query.category as string | undefined;

      const whereClause: any = { userId };
      if (category && category !== 'All') {
        whereClause.category = category;
      }

      const notifications = await prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        statusCode: 200,
        message: 'Notifications retrieved successfully',
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new BadRequestError('Invalid notification ID');

      const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });

      res.status(200).json({
        statusCode: 200,
        message: 'Notification marked as read',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);

      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      res.status(200).json({
        statusCode: 200,
        message: 'All notifications marked as read',
      });
    } catch (error) {
      next(error);
    }
  }
}

