import { Router } from 'express';
import { MediaController } from '../controllers/media.controller';

const mediaController = new MediaController();
const router = Router();

router.post('/delete', (req, res, next) => mediaController.deleteMedia(req, res, next));
router.delete('/', (req, res, next) => mediaController.deleteMedia(req, res, next));

export default router;
