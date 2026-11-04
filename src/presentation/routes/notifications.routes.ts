import { Router } from 'express';
import { NotificationsController } from '../controllers/notifications.controller';

const notificationsController = new NotificationsController();
const router = Router();

router.get('/', (req, res, next) => notificationsController.getNotifications(req, res, next));
router.patch('/:id/read', (req, res, next) => notificationsController.markAsRead(req, res, next));
router.post('/read-all', (req, res, next) => notificationsController.markAllAsRead(req, res, next));

export default router;

