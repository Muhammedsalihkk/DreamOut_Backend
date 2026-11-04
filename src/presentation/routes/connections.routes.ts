import { Router } from 'express';
import { ConnectionsController } from '../controllers/connections.controller';

const connectionsController = new ConnectionsController();
const router = Router();

router.get('/followers/:userId', (req, res, next) => connectionsController.getFollowers(req, res, next));
router.get('/following/:userId', (req, res, next) => connectionsController.getFollowing(req, res, next));
router.post('/follow/:targetUserId', (req, res, next) => connectionsController.toggleFollow(req, res, next));
router.get('/stats/:userId', (req, res, next) => connectionsController.getStats(req, res, next));

export default router;

