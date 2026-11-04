import { Router } from 'express';
import { SavedController } from '../controllers/saved.controller';

const savedController = new SavedController();
const router = Router();

router.get('/', (req, res, next) => savedController.getUserSaved(req, res, next));
router.post('/route/:id', (req, res, next) => savedController.toggleRoute(req, res, next));
router.post('/spot/:id', (req, res, next) => savedController.toggleSpot(req, res, next));
router.post('/moment/:id', (req, res, next) => savedController.toggleMoment(req, res, next));

export default router;

