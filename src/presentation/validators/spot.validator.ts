import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../domain/errors/domain.error';

export function validateCreateSpot(req: Request, _res: Response, next: NextFunction): void {
  const { name, latitude, longitude, category, description } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return next(new BadRequestError('Name is required and must be a non-empty string'));
  }
  if (name.length > 150) {
    return next(new BadRequestError('Name must not exceed 150 characters'));
  }

  if (description !== undefined && description !== null && typeof description !== 'string') {
    return next(new BadRequestError('Description must be a string'));
  }

  if (latitude === undefined || latitude === null || typeof Number(latitude) !== 'number' || isNaN(Number(latitude))) {
    return next(new BadRequestError('Latitude is required and must be a valid number'));
  }

  if (longitude === undefined || longitude === null || typeof Number(longitude) !== 'number' || isNaN(Number(longitude))) {
    return next(new BadRequestError('Longitude is required and must be a valid number'));
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return next(new BadRequestError('Category is required and must be a non-empty string'));
  }
  if (category.length > 50) {
    return next(new BadRequestError('Category must not exceed 50 characters'));
  }

  next();
}

export function validateUpdateSpot(req: Request, _res: Response, next: NextFunction): void {
  const { name, latitude, longitude, category, description } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return next(new BadRequestError('Name must be a non-empty string'));
    }
    if (name.length > 150) {
      return next(new BadRequestError('Name must not exceed 150 characters'));
    }
  }

  if (description !== undefined && description !== null && typeof description !== 'string') {
    return next(new BadRequestError('Description must be a string'));
  }

  if (latitude !== undefined && (typeof Number(latitude) !== 'number' || isNaN(Number(latitude)))) {
    return next(new BadRequestError('Latitude must be a valid number'));
  }

  if (longitude !== undefined && (typeof Number(longitude) !== 'number' || isNaN(Number(longitude)))) {
    return next(new BadRequestError('Longitude must be a valid number'));
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim().length === 0) {
      return next(new BadRequestError('Category must be a non-empty string'));
    }
    if (category.length > 50) {
      return next(new BadRequestError('Category must not exceed 50 characters'));
    }
  }

  next();
}
