import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';

// Create custom token for request body
morgan.token('body', (req: Request) => {
  if (['POST', 'PUT'].includes(req.method)) {
    return JSON.stringify(req.body);
  }
  return '';
});

// Format: method url status response-time ms - request body
export const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body',
  {
    skip: (req: Request) => process.env.NODE_ENV === 'test'
  }
);