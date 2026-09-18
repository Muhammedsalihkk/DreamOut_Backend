import { Router, Request, Response } from 'express';
import usersRouter from './users.routes';
import healthRouter from './health.routes';
import spotsRouter from './spots.routes';
import authRouter from './auth.routes';

const apiRouter = Router();
apiRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Hello World!');
});
apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/spots', spotsRouter);

export default apiRouter;



