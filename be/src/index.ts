import mongoose from 'mongoose';
import { app } from './app';
import env from './config';
import logger from './logger';

logger.log(process.env.MONGOOSE_URI ?? 'No connection string');

const connect_db_prom = Promise.all([
  mongoose.connect(env.MONGOOSE_URI, {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
  }),
  mongoose.set('debug', true),
]);

async function main() {
  await connect_db_prom;

  logger.log('Connected to MongoDB successfully');

  app.listen(env.PORT, () => {
    logger.log(`Server is running on port ${env.PORT}`);
  });
}

main().catch((err) => {
  logger.error('Failed to start the server: ' + err);
  process.exit(1);
});
