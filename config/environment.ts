import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Environment {
  port: number;
  nodeEnv: string;
}

export const environment: Environment = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default environment;