import { Router, Request, Response } from 'express';
import usersRouter from './users.routes';
import healthRouter from './health.routes';
import spotsRouter from './spots.routes';
import routesRouter from './routes.routes';
import authRouter from './auth.routes';
import mediaRouter from './media.routes';
import journeysRouter from './journeys.routes';
import commentsRouter from './comments.routes';
import savedRouter from './saved.routes';
import connectionsRouter from './connections.routes';
import notificationsRouter from './notifications.routes';
import storiesRouter from './stories.routes';
import momentsRouter from './moments.routes';

const apiRouter = Router();
apiRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Hello World!');
});
apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/spots', spotsRouter);
apiRouter.use('/routes', routesRouter);
apiRouter.use('/media', mediaRouter);
apiRouter.use('/journeys', journeysRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/saved', savedRouter);
apiRouter.use('/connections', connectionsRouter);
apiRouter.use('/notifications', notificationsRouter);
apiRouter.use('/stories', storiesRouter);
apiRouter.use('/moments', momentsRouter);

export default apiRouter;
