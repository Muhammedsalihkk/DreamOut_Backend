import { Request, Response, NextFunction } from 'express';
import { CreateRouteUseCase } from '../../application/use-cases/routes/create-route.use-case';
import { GetRoutesUseCase } from '../../application/use-cases/routes/get-routes.use-case';
import { GetRouteUseCase } from '../../application/use-cases/routes/get-route.use-case';
import { UpdateRouteUseCase } from '../../application/use-cases/routes/update-route.use-case';
import { DeleteRouteUseCase } from '../../application/use-cases/routes/delete-route.use-case';
import { JwtService } from '../../infrastructure/security/jwt.service';

export class RoutesController {
  constructor(
    private createRouteUseCase: CreateRouteUseCase,
    private getRoutesUseCase: GetRoutesUseCase,
    private getRouteUseCase: GetRouteUseCase,
    private updateRouteUseCase: UpdateRouteUseCase,
    private deleteRouteUseCase: DeleteRouteUseCase,
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
          // Token invalid or expired
        }
      }

      if (!userId && (req as any).user?.id) {
        userId = Number((req as any).user.id);
      }

      if (!userId && req.body.userId) {
        userId = Number(req.body.userId);
      }

      if (!userId) {
        userId = 6;
      }

      const route = await this.createRouteUseCase.execute(req.body, userId);
      res.status(201).json({
        statusCode: 201,
        message: 'Route created successfully',
        data: route,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const routes = await this.getRoutesUseCase.execute();
      res.status(200).json({
        statusCode: 200,
        message: 'Routes retrieved successfully',
        data: routes,
      });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const route = await this.getRouteUseCase.execute(id);
      res.status(200).json({
        statusCode: 200,
        message: 'Route retrieved successfully',
        data: route,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const updatedRoute = await this.updateRouteUseCase.execute(id, req.body);
      res.status(200).json({
        statusCode: 200,
        message: 'Route updated successfully',
        data: updatedRoute,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.deleteRouteUseCase.execute(id);
      res.status(200).json({
        statusCode: 200,
        message: 'Route deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
