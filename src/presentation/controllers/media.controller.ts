import { Request, Response, NextFunction } from 'express';
import { BackendCloudinaryService } from '../../infrastructure/security/cloudinary.service';
import { BadRequestError } from '../../domain/errors/domain.error';

export class MediaController {
  async deleteMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.body.publicId || req.body.url || req.query.publicId || req.query.url;

      if (!publicId || typeof publicId !== 'string') {
        throw new BadRequestError('publicId or url is required in request body or query parameter');
      }

      const result = await BackendCloudinaryService.deleteAsset(publicId);

      res.status(result.success ? 200 : 200).json({
        statusCode: result.success ? 200 : 200,
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
