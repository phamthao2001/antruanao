import express from 'express';
import { all_routes } from './routes/index.route';

export const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

all_routes.forEach((route) => {
  app.use('/api', route);
});
