import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../domain/errors/domain.error';

export function validateCreateUser(req: Request, _res: Response, next: NextFunction): void {
  const { email, name, password } = req.body;

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return next(new BadRequestError('Email is required and must be a valid string'));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return next(new BadRequestError('Invalid email format'));
  }

  if (name !== undefined && name !== null && typeof name !== 'string') {
    return next(new BadRequestError('Name must be a string'));
  }

  if (password !== undefined && password !== null && typeof password !== 'string') {
    return next(new BadRequestError('Password must be a string'));
  }

  next();
}

export function validateUpdateUser(req: Request, _res: Response, next: NextFunction): void {
  const { email, name, password } = req.body;

  if (email !== undefined) {
    if (typeof email !== 'string' || email.trim().length === 0) {
      return next(new BadRequestError('Email must be a valid string'));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return next(new BadRequestError('Invalid email format'));
    }
  }

  if (name !== undefined && name !== null && typeof name !== 'string') {
    return next(new BadRequestError('Name must be a string'));
  }

  if (password !== undefined && password !== null && typeof password !== 'string') {
    return next(new BadRequestError('Password must be a string'));
  }

  next();
}
