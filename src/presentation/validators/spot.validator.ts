import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../domain/errors/domain.error';

export function validateCreateSpot(req: Request, _res: Response, next: NextFunction): void {
  const { name, latitude, longitude, category, description, image, location, userId } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return next(new BadRequestError('Spot name is required and must be a non-empty string'));
  }
  if (name.trim().length > 150) {
    return next(new BadRequestError('Spot name must not exceed 150 characters'));
  }

  if (description !== undefined && description !== null && typeof description !== 'string') {
    return next(new BadRequestError('Description must be a string'));
  }

  if (image !== undefined && image !== null && typeof image !== 'string') {
    return next(new BadRequestError('Image must be a string'));
  }

  if (location !== undefined && location !== null) {
    if (typeof location !== 'string' || location.trim().length === 0) {
      return next(new BadRequestError('Location must be a non-empty string'));
    }
    if (location.trim().length > 150) {
      return next(new BadRequestError('Location must not exceed 150 characters'));
    }
  }

  if (latitude !== undefined && latitude !== null) {
    const latNum = Number(latitude);
    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      return next(new BadRequestError('Latitude must be a valid number between -90 and 90'));
    }
  }

  if (longitude !== undefined && longitude !== null) {
    const lngNum = Number(longitude);
    if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      return next(new BadRequestError('Longitude must be a valid number between -180 and 180'));
    }
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return next(new BadRequestError('Spot category is required and must be a non-empty string'));
  }
  if (category.trim().length > 50) {
    return next(new BadRequestError('Spot category must not exceed 50 characters'));
  }

  if (userId !== undefined && userId !== null) {
    const uNum = Number(userId);
    if (isNaN(uNum) || !Number.isInteger(uNum) || uNum <= 0) {
      return next(new BadRequestError('User ID must be a valid positive integer'));
    }
  }

  next();
}

export function validateUpdateSpot(req: Request, _res: Response, next: NextFunction): void {
  const { name, latitude, longitude, category, description, image, location } = req.body;

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

  if (image !== undefined && image !== null && typeof image !== 'string') {
    return next(new BadRequestError('Image must be a string'));
  }

  if (location !== undefined && location !== null && typeof location !== 'string') {
    return next(new BadRequestError('Location must be a string'));
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
