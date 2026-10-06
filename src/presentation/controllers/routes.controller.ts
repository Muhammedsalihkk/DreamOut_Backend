import { Request, Response, NextFunction } from 'express';
import { CreateRouteUseCase } from '../../application/use-cases/routes/create-route.use-case';
import { GetRoutesUseCase } from '../../application/use-cases/routes/get-routes.use-case';
import { GetRouteUseCase } from '../../application/use-cases/routes/get-route.use-case';
import { UpdateRouteUseCase } from '../../application/use-cases/routes/update-route.use-case';
import { DeleteRouteUseCase } from '../../application/use-cases/routes/delete-route.use-case';

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
      const userId = (req as any).user?.id ? Number((req as any).user.id) : (req.body.userId ? Number(req.body.userId) : 6);
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
