import { Router } from 'express';
import { MomentsController } from '../controllers/moments.controller';

const momentsController = new MomentsController();
const router = Router();

router.get('/', (req, res, next) => momentsController.getMoments(req, res, next));
router.get('/:id', (req, res, next) => momentsController.getById(req, res, next));
router.post('/', (req, res, next) => momentsController.create(req, res, next));
router.post('/:id/like', (req, res, next) => momentsController.like(req, res, next));
router.delete('/:id', (req, res, next) => momentsController.remove(req, res, next));

export default router;

