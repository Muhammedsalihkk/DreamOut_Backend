import { Request, Response, NextFunction } from 'express';
import { CreateSpotUseCase } from '../../application/use-cases/spots/create-spot.use-case';
import { GetSpotsUseCase } from '../../application/use-cases/spots/get-spots.use-case';
import { GetSpotUseCase } from '../../application/use-cases/spots/get-spot.use-case';
import { UpdateSpotUseCase } from '../../application/use-cases/spots/update-spot.use-case';
import { DeleteSpotUseCase } from '../../application/use-cases/spots/delete-spot.use-case';
import { JwtService } from '../../infrastructure/security/jwt.service';

export class SpotsController {
  constructor(
    private createSpotUseCase: CreateSpotUseCase,
    private getSpotsUseCase: GetSpotsUseCase,
    private getSpotUseCase: GetSpotUseCase,
    private updateSpotUseCase: UpdateSpotUseCase,
    private deleteSpotUseCase: DeleteSpotUseCase,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let userId: number | undefined;

      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = JwtService.verifyToken<{ userId: number }>(token);
          if (decoded && decoded.userId) {
            userId = Number(decoded.userId);
          }
        } catch {
          // Token invalid or expired, continue without token
        }
      }

      if (!userId && (req as any).user?.id) {
        userId = Number((req as any).user.id);
      }

      if (!userId && req.body.userId) {
        userId = Number(req.body.userId);
      }

      const spot = await this.createSpotUseCase.execute(req.body, userId);
      res.status(201).json({
        statusCode: 201,
        message: 'Spot created successfully',
        data: spot,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const spots = await this.getSpotsUseCase.execute();
      res.status(200).json({
        statusCode: 200,
        message: 'Spots retrieved successfully',
        data: spots,
      });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const spot = await this.getSpotUseCase.execute(id);
      res.status(200).json({
        statusCode: 200,
        message: 'Spot retrieved successfully',
        data: spot,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const updatedSpot = await this.updateSpotUseCase.execute(id, req.body);
      res.status(200).json({
        statusCode: 200,
        message: 'Spot updated successfully',
        data: updatedSpot,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.deleteSpotUseCase.execute(id);
      res.status(200).json({
        statusCode: 200,
        message: 'Spot deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
