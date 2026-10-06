import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../domain/errors/domain.error';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof DomainError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      error: err.message,
    });
    return;
  }

  const prismaCode = (err as any).code;

  // Handle Prisma P2002 (Unique constraint failed)
  if (prismaCode === 'P2002') {
    const target = (err as any).meta?.target;
    const field = Array.isArray(target) ? target.join(', ') : (target || 'field');
    res.status(409).json({
      statusCode: 409,
      message: `A record with this ${field || 'value'} already exists`,
      error: `Conflict: ${field || 'value'} already exists`,
    });
    return;
  }

  // Handle Prisma P2003 (Foreign key constraint failed)
  if (prismaCode === 'P2003') {
    const field = (err as any).meta?.field_name || 'relation';
    res.status(400).json({
      statusCode: 400,
      message: `Invalid relation or referenced record not found (${field})`,
      error: 'Foreign key constraint violation',
    });
    return;
  }

  // Handle Prisma P2025 (Record to update/delete not found)
  if (prismaCode === 'P2025') {
    res.status(404).json({
      statusCode: 404,
      message: 'The requested record was not found',
      error: 'Record not found',
    });
    return;
  }

  // Handle Prisma P2000 (Value too long for column)
  if (prismaCode === 'P2000') {
    res.status(400).json({
      statusCode: 400,
      message: 'The provided value exceeds the maximum allowable length',
      error: 'Value too long',
    });
    return;
  }

  // Handle PrismaClientValidationError
  if ((err as any).name === 'PrismaClientValidationError') {
    res.status(400).json({
      statusCode: 400,
      message: 'Invalid data format provided for database operation',
      error: 'Validation Error',
    });
    return;
  }

  const customErr = err as Error & { statusCode?: number; status?: number };
  const statusCode = customErr.statusCode || customErr.status || 500;
  const message = customErr.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode} - ${message}`, err.stack);

  res.status(statusCode).json({
    statusCode,
    message: statusCode === 500 ? 'An unexpected server error occurred. Please try again.' : message,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
