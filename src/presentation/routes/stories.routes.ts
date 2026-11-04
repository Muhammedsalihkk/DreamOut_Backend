import { Router } from 'express';
import { StoriesController } from '../controllers/stories.controller';

const storiesController = new StoriesController();
const router = Router();

router.get('/', (req, res, next) => storiesController.getStories(req, res, next));
router.get('/:id', (req, res, next) => storiesController.getById(req, res, next));
router.post('/', (req, res, next) => storiesController.create(req, res, next));
router.delete('/:id', (req, res, next) => storiesController.remove(req, res, next));

export default router;

