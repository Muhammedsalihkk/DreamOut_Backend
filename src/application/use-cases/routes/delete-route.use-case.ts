import { IRouteRepository } from '../../../domain/repositories/route.repository';
import { RouteResponseDTO } from '../../dtos/route.dto';
import { NotFoundError, BadRequestError } from '../../../domain/errors/domain.error';
import { BackendCloudinaryService } from '../../../infrastructure/security/cloudinary.service';

export class DeleteRouteUseCase {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(id: number): Promise<RouteResponseDTO> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError('Invalid Route ID');
    }

    const existingRoute = await this.routeRepository.findById(id);
    if (!existingRoute) {
      throw new NotFoundError('Route', id);
    }

    if (existingRoute.coverImage && BackendCloudinaryService.isCloudinaryUrl(existingRoute.coverImage)) {
      BackendCloudinaryService.deleteAsset(existingRoute.coverImage).catch((err) => {
        console.warn(`[DeleteRouteUseCase] Could not cleanup Cloudinary asset: ${err?.message}`);
      });
    }

    return this.routeRepository.delete(id);
  }
}
