import { Router } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { PrismaSpotRepository } from '../../infrastructure/database/repositories/prisma-spot.repository';
import { CreateSpotUseCase } from '../../application/use-cases/spots/create-spot.use-case';
import { GetSpotsUseCase } from '../../application/use-cases/spots/get-spots.use-case';
import { GetSpotUseCase } from '../../application/use-cases/spots/get-spot.use-case';
import { UpdateSpotUseCase } from '../../application/use-cases/spots/update-spot.use-case';
import { DeleteSpotUseCase } from '../../application/use-cases/spots/delete-spot.use-case';
import { SpotsController } from '../controllers/spots.controller';
import { validateCreateSpot, validateUpdateSpot } from '../validators/spot.validator';

const spotRepository = new PrismaSpotRepository(prisma);
const createSpotUseCase = new CreateSpotUseCase(spotRepository);
const getSpotsUseCase = new GetSpotsUseCase(spotRepository);
const getSpotUseCase = new GetSpotUseCase(spotRepository);
const updateSpotUseCase = new UpdateSpotUseCase(spotRepository);
const deleteSpotUseCase = new DeleteSpotUseCase(spotRepository);

const spotsController = new SpotsController(
  createSpotUseCase,
  getSpotsUseCase,
  getSpotUseCase,
  updateSpotUseCase,
  deleteSpotUseCase,
);

const router = Router();

router.post('/', validateCreateSpot, (req, res, next) => spotsController.create(req, res, next));
router.get('/', (req, res, next) => spotsController.findAll(req, res, next));
router.get('/:id', (req, res, next) => spotsController.findOne(req, res, next));
router.patch('/:id', validateUpdateSpot, (req, res, next) => spotsController.update(req, res, next));
router.delete('/:id', (req, res, next) => spotsController.remove(req, res, next));

export default router;
