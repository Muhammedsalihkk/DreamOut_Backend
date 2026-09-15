import { ISpotRepository } from '../../../domain/repositories/spot.repository';
import { UpdateSpotDTO, SpotResponseDTO } from '../../dtos/spot.dto';
import { NotFoundError, BadRequestError } from '../../../domain/errors/domain.error';

export class UpdateSpotUseCase {
  constructor(private spotRepository: ISpotRepository) {}

  async execute(id: number, dto: UpdateSpotDTO): Promise<SpotResponseDTO> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError('Invalid Spot ID');
    }

    const existingSpot = await this.spotRepository.findById(id);
    if (!existingSpot) {
      throw new NotFoundError('Spot', id);
    }

    if (dto.name !== undefined) {
      if (dto.name.trim().length === 0) {
        throw new BadRequestError('Spot name cannot be empty');
      }
      if (dto.name.length > 150) {
        throw new BadRequestError('Spot name must not exceed 150 characters');
      }
    }

    if (dto.category !== undefined) {
      if (dto.category.trim().length === 0) {
        throw new BadRequestError('Spot category cannot be empty');
      }
      if (dto.category.length > 50) {
        throw new BadRequestError('Spot category must not exceed 50 characters');
      }
    }

    if (dto.latitude !== undefined && isNaN(Number(dto.latitude))) {
      throw new BadRequestError('Latitude must be a valid number');
    }

    if (dto.longitude !== undefined && isNaN(Number(dto.longitude))) {
      throw new BadRequestError('Longitude must be a valid number');
    }

    return this.spotRepository.update(id, {
      ...(dto.name !== undefined && { name: dto.name.trim() }),
      ...(dto.description !== undefined && { description: dto.description ? dto.description.trim() : null }),
      ...(dto.latitude !== undefined && { latitude: Number(dto.latitude) }),
      ...(dto.longitude !== undefined && { longitude: Number(dto.longitude) }),
      ...(dto.category !== undefined && { category: dto.category.trim() }),
    });
  }
}
