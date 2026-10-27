import { Router } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { PrismaJourneyRepository } from '../../infrastructure/database/repositories/prisma-journey.repository';
import { StartJourneyUseCase } from '../../application/use-cases/journeys/start-journey.use-case';
import { UpdateJourneyProgressUseCase } from '../../application/use-cases/journeys/update-journey-progress.use-case';
import { AddJourneyMomentUseCase } from '../../application/use-cases/journeys/add-journey-moment.use-case';
import { CompleteJourneyUseCase } from '../../application/use-cases/journeys/complete-journey.use-case';
import { GetJourneyUseCase } from '../../application/use-cases/journeys/get-journey.use-case';
import { GetUserJourneysUseCase } from '../../application/use-cases/journeys/get-user-journeys.use-case';
import { JourneysController } from '../controllers/journeys.controller';

const journeyRepository = new PrismaJourneyRepository(prisma);
const startJourneyUseCase = new StartJourneyUseCase(journeyRepository);
const updateJourneyProgressUseCase = new UpdateJourneyProgressUseCase(journeyRepository);
const addJourneyMomentUseCase = new AddJourneyMomentUseCase(journeyRepository);
const completeJourneyUseCase = new CompleteJourneyUseCase(journeyRepository);
const getJourneyUseCase = new GetJourneyUseCase(journeyRepository);
const getUserJourneysUseCase = new GetUserJourneysUseCase(journeyRepository);

const journeysController = new JourneysController(
  startJourneyUseCase,
  updateJourneyProgressUseCase,
  addJourneyMomentUseCase,
  completeJourneyUseCase,
  getJourneyUseCase,
  getUserJourneysUseCase,
);

const router = Router();

router.post('/start', (req, res, next) => journeysController.start(req, res, next));
router.get('/user/me', (req, res, next) => journeysController.getUserJourneys(req, res, next));
router.get('/:id', (req, res, next) => journeysController.findById(req, res, next));
router.patch('/:id/progress', (req, res, next) => journeysController.updateProgress(req, res, next));
router.post('/:id/moments', (req, res, next) => journeysController.addMoment(req, res, next));
router.post('/:id/complete', (req, res, next) => journeysController.complete(req, res, next));

export default router;
