import { ISpotRepository } from '../../../domain/repositories/spot.repository';
import { SpotResponseDTO } from '../../dtos/spot.dto';
import { NotFoundError, BadRequestError } from '../../../domain/errors/domain.error';

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

    return this.spotRepository.delete(id);
  }
}
