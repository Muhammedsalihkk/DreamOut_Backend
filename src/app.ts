import express, { Application } from 'express';
import cors from 'cors';
import apiRouter from './presentation/routes/api.routes';
import { errorHandler } from './presentation/middleware/error.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.use(errorHandler);

export default app;
