import { Router } from 'express';
import { CommentsController } from '../controllers/comments.controller';

const commentsController = new CommentsController();
const router = Router();

router.get('/route/:routeId', (req, res, next) => commentsController.findByRoute(req, res, next));
router.get('/spot/:spotId', (req, res, next) => commentsController.findBySpot(req, res, next));
router.post('/', (req, res, next) => commentsController.create(req, res, next));
router.post('/:id/like', (req, res, next) => commentsController.toggleLike(req, res, next));
router.delete('/:id', (req, res, next) => commentsController.remove(req, res, next));

export default router;

