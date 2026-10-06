import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../domain/errors/domain.error';

export function validateCreateRoute(req: Request, _res: Response, next: NextFunction): void {
  const { title, category } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return next(new BadRequestError('Title is required and must be a non-empty string'));
  }
  if (title.length > 150) {
    return next(new BadRequestError('Title must not exceed 150 characters'));
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return next(new BadRequestError('Category is required and must be a non-empty string'));
  }

  next();
}

export function validateUpdateRoute(req: Request, _res: Response, next: NextFunction): void {
  const { title } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return next(new BadRequestError('Title must be a non-empty string'));
    }
    if (title.length > 150) {
      return next(new BadRequestError('Title must not exceed 150 characters'));
    }
  }

  next();
}
