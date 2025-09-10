import dotenv from 'dotenv';

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGOOSE_URI: process.env.MONGOOSE_URI || 'mongodb://localhost:27017/mydatabase',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
};

export default env;
