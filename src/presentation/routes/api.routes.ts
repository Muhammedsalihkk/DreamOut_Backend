import { Router, Request, Response } from 'express';
import usersRouter from './users.routes';
import healthRouter from './health.routes';
import spotsRouter from './spots.routes';

const apiRouter = Router();
apiRouter.use('/users', usersRouter);
apiRouter.use('/spots', spotsRouter);

export default apiRouter;
