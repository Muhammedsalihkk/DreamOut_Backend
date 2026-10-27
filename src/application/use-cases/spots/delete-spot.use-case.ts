import { ISpotRepository } from '../../../domain/repositories/spot.repository';
import { SpotResponseDTO } from '../../dtos/spot.dto';
import { NotFoundError, BadRequestError } from '../../../domain/errors/domain.error';
import { BackendCloudinaryService } from '../../../infrastructure/security/cloudinary.service';

export class DeleteSpotUseCase {
  constructor(private spotRepository: ISpotRepository) {}

  async execute(id: number): Promise<SpotResponseDTO> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError('Invalid Spot ID');
    }

    const spot = await this.spotRepository.findById(id);
    if (!spot) {
      throw new NotFoundError('Spot', id);
    }

    if (spot.image && BackendCloudinaryService.isCloudinaryUrl(spot.image)) {
      BackendCloudinaryService.deleteAsset(spot.image).catch((err) => {
        console.warn(`[DeleteSpotUseCase] Could not cleanup Cloudinary asset: ${err?.message}`);
      });
    }

    return this.spotRepository.delete(id);
  }
}
