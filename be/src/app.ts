import cors from 'cors';
import express from 'express';
import { all_routes } from './routes/index.route';

export const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

all_routes.forEach((route) => {
  app.use('/api', route);
});
