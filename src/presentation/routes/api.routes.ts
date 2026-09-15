import { Router, Request, Response } from 'express';
import usersRouter from './users.routes';
import healthRouter from './health.routes';

const apiRouter = Router();

apiRouter.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

apiRouter.use('/health', healthRouter);
apiRouter.use('/users', usersRouter);

export default apiRouter;
