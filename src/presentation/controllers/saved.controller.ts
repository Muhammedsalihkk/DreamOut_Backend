import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { JwtService } from '../../infrastructure/security/jwt.service';
import { BadRequestError } from '../../domain/errors/domain.error';

export class SavedController {
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
    if (req.query.userId) return Number(req.query.userId);
    return 1; // Default explorer user
  }

  async getUserSaved(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);

      const savedItems = await prisma.savedItem.findMany({
        where: { userId },
        include: {
          route: {
            include: {
              user: {
                select: { id: true, name: true, avatar: true, email: true },
              },
            },
          },
          spot: {
            include: {
              user: {
                select: { id: true, name: true, avatar: true, email: true },
              },
            },
          },
          moment: {
            include: {
              user: {
                select: { id: true, name: true, avatar: true, email: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const routes = savedItems.filter((i) => i.route).map((i) => i.route);
      const spots = savedItems.filter((i) => i.spot).map((i) => i.spot);
      const moments = savedItems.filter((i) => i.moment).map((i) => i.moment);

      res.status(200).json({
        statusCode: 200,
        message: 'Saved items retrieved successfully',
        data: {
          routes,
          spots,
          moments,
          savedRouteIds: routes.map((r: any) => String(r.id)),
          savedSpotIds: spots.map((s: any) => String(s.id)),
          savedMomentIds: moments.map((m: any) => String(m.id)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const routeId = Number(req.params.id);
      if (isNaN(routeId)) throw new BadRequestError('Invalid route ID');
      const userId = this.extractUserId(req);

      const existing = await prisma.savedItem.findFirst({
        where: { userId, routeId },
      });

      if (existing) {
        await prisma.savedItem.delete({ where: { id: existing.id } });
        res.status(200).json({
          statusCode: 200,
          message: 'Route removed from saved',
          data: { isSaved: false, routeId },
        });
      } else {
        await prisma.savedItem.create({
          data: { userId, routeId },
        });
        res.status(200).json({
          statusCode: 200,
          message: 'Route saved successfully',
          data: { isSaved: true, routeId },
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async toggleSpot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const spotId = Number(req.params.id);
      if (isNaN(spotId)) throw new BadRequestError('Invalid spot ID');
      const userId = this.extractUserId(req);

      const existing = await prisma.savedItem.findFirst({
        where: { userId, spotId },
      });

      if (existing) {
        await prisma.savedItem.delete({ where: { id: existing.id } });
        res.status(200).json({
          statusCode: 200,
          message: 'Spot removed from saved',
          data: { isSaved: false, spotId },
        });
      } else {
        await prisma.savedItem.create({
          data: { userId, spotId },
        });
        res.status(200).json({
          statusCode: 200,
          message: 'Spot saved successfully',
          data: { isSaved: true, spotId },
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async toggleMoment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const momentId = Number(req.params.id);
      if (isNaN(momentId)) throw new BadRequestError('Invalid moment ID');
      const userId = this.extractUserId(req);

      const existing = await prisma.savedItem.findFirst({
        where: { userId, momentId },
      });

      if (existing) {
        await prisma.savedItem.delete({ where: { id: existing.id } });
        res.status(200).json({
          statusCode: 200,
          message: 'Moment removed from saved',
          data: { isSaved: false, momentId },
        });
      } else {
        await prisma.savedItem.create({
          data: { userId, momentId },
        });
        res.status(200).json({
          statusCode: 200,
          message: 'Moment saved successfully',
          data: { isSaved: true, momentId },
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

