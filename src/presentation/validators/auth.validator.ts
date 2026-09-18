import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../domain/errors/domain.error';

export function validateLogin(req: Request, _res: Response, next: NextFunction): void {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return next(new BadRequestError('Email is required'));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return next(new BadRequestError('Invalid email format'));
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return next(new BadRequestError('Password is required'));
  }

  next();
}
