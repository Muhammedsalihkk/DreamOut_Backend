import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { JwtService } from '../../infrastructure/security/jwt.service';
import { BadRequestError } from '../../domain/errors/domain.error';

export class ConnectionsController {
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
    if (req.body.currentUserId) return Number(req.body.currentUserId);
    if (req.query.currentUserId) return Number(req.query.currentUserId);
    return 1;
  }

  async getFollowers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = Number(req.params.userId || req.params.id);
      if (isNaN(targetUserId)) throw new BadRequestError('Invalid user ID');

      const follows = await prisma.follow.findMany({
        where: { followingId: targetUserId },
        include: {
          follower: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const followers = follows.map((f) => ({
        id: String(f.follower.id),
        name: f.follower.name || 'Explorer',
        username: (f.follower.name || 'explorer').toLowerCase().replace(/\s+/g, '_'),
        avatar: f.follower.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        isVerified: true,
      }));

      res.status(200).json({
        statusCode: 200,
        message: 'Followers retrieved successfully',
        data: followers,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFollowing(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = Number(req.params.userId || req.params.id);
      if (isNaN(targetUserId)) throw new BadRequestError('Invalid user ID');

      const follows = await prisma.follow.findMany({
        where: { followerId: targetUserId },
        include: {
          following: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const following = follows.map((f) => ({
        id: String(f.following.id),
        name: f.following.name || 'Explorer',
        username: (f.following.name || 'explorer').toLowerCase().replace(/\s+/g, '_'),
        avatar: f.following.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        isVerified: true,
      }));

      res.status(200).json({
        statusCode: 200,
        message: 'Following retrieved successfully',
        data: following,
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleFollow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = Number(req.params.targetUserId || req.params.id);
      if (isNaN(targetUserId)) throw new BadRequestError('Invalid user ID');

      const currentUserId = this.extractUserId(req);
      if (currentUserId === targetUserId) {
        throw new BadRequestError('You cannot follow yourself');
      }

      const existing = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
      });

      if (existing) {
        await prisma.follow.delete({ where: { id: existing.id } });
        res.status(200).json({
          statusCode: 200,
          message: 'Unfollowed successfully',
          data: { isFollowing: false, targetUserId },
        });
      } else {
        await prisma.follow.create({
          data: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        });

        // Create notification for followed user
        const followerUser = await prisma.user.findUnique({
          where: { id: currentUserId },
          select: { name: true },
        });

        await prisma.notification.create({
          data: {
            userId: targetUserId,
            actorId: currentUserId,
            type: 'follow',
            category: 'Follows',
            title: 'New Follower',
            message: `${followerUser?.name || 'Someone'} started following you.`,
          },
        }).catch(() => {});

        res.status(200).json({
          statusCode: 200,
          message: 'Followed successfully',
          data: { isFollowing: true, targetUserId },
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.params.userId || req.params.id);
      if (isNaN(userId)) throw new BadRequestError('Invalid user ID');

      const [followersCount, followingCount] = await Promise.all([
        prisma.follow.count({ where: { followingId: userId } }),
        prisma.follow.count({ where: { followerId: userId } }),
      ]);

      res.status(200).json({
        statusCode: 200,
        message: 'Connection stats retrieved successfully',
        data: { followersCount, followingCount },
      });
    } catch (error) {
      next(error);
    }
  }
}

