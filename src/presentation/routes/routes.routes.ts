import { Router } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { PrismaRouteRepository } from '../../infrastructure/database/repositories/prisma-route.repository';
import { CreateRouteUseCase } from '../../application/use-cases/routes/create-route.use-case';
import { GetRoutesUseCase } from '../../application/use-cases/routes/get-routes.use-case';
import { GetRouteUseCase } from '../../application/use-cases/routes/get-route.use-case';
import { UpdateRouteUseCase } from '../../application/use-cases/routes/update-route.use-case';
import { DeleteRouteUseCase } from '../../application/use-cases/routes/delete-route.use-case';
import { RoutesController } from '../controllers/routes.controller';
import { validateCreateRoute, validateUpdateRoute } from '../validators/route.validator';

const routeRepository = new PrismaRouteRepository(prisma);
const createRouteUseCase = new CreateRouteUseCase(routeRepository);
const getRoutesUseCase = new GetRoutesUseCase(routeRepository);
const getRouteUseCase = new GetRouteUseCase(routeRepository);
const updateRouteUseCase = new UpdateRouteUseCase(routeRepository);
const deleteRouteUseCase = new DeleteRouteUseCase(routeRepository);

const routesController = new RoutesController(
  createRouteUseCase,
  getRoutesUseCase,
  getRouteUseCase,
  updateRouteUseCase,
  deleteRouteUseCase,
);

const router = Router();

router.post('/', validateCreateRoute, (req, res, next) => routesController.create(req, res, next));
router.get('/', (req, res, next) => routesController.findAll(req, res, next));
router.get('/:id', (req, res, next) => routesController.findOne(req, res, next));
router.patch('/:id', validateUpdateRoute, (req, res, next) => routesController.update(req, res, next));
router.delete('/:id', (req, res, next) => routesController.remove(req, res, next));

export default router;
