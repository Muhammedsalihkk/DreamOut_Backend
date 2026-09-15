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
    });
    return;
  }

  // Handle Prisma P2002 (Unique constraint failed)
  if ((err as any).code === 'P2002') {
    const target = (err as any).meta?.target;
    const field = Array.isArray(target) ? target.join(', ') : 'field';
    res.status(409).json({
      statusCode: 409,
      message: `A record with this ${field || 'value'} already exists`,
    });
    return;
  }

  const customErr = err as Error & { statusCode?: number; status?: number };
  const statusCode = customErr.statusCode || customErr.status || 500;
  const message = customErr.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode} - ${message}`, err.stack);

  res.status(statusCode).json({
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
