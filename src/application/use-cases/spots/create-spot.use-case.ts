import { ISpotRepository } from '../../../domain/repositories/spot.repository';
import { CreateSpotDTO, SpotResponseDTO } from '../../dtos/spot.dto';
import { BadRequestError } from '../../../domain/errors/domain.error';

export class CreateSpotUseCase {
  constructor(private spotRepository: ISpotRepository) {}

  async execute(dto: CreateSpotDTO, fallbackUserId?: number): Promise<SpotResponseDTO> {
    const userId = dto.userId || fallbackUserId || 1;

    if (!dto.name || dto.name.trim().length === 0) {
      throw new BadRequestError('Spot name is required');
    }
    if (dto.name.length > 150) {
      throw new BadRequestError('Spot name must not exceed 150 characters');
    }
    if (dto.latitude === undefined || dto.latitude === null || isNaN(Number(dto.latitude))) {
      throw new BadRequestError('Valid latitude is required');
    }
    if (dto.longitude === undefined || dto.longitude === null || isNaN(Number(dto.longitude))) {
      throw new BadRequestError('Valid longitude is required');
    }
    if (!dto.category || dto.category.trim().length === 0) {
      throw new BadRequestError('Spot category is required');
    }
    if (dto.category.length > 50) {
      throw new BadRequestError('Spot category must not exceed 50 characters');
    }

    return this.spotRepository.create({
      userId,
      name: dto.name.trim(),
      description: dto.description ? dto.description.trim() : null,
      latitude: Number(dto.latitude),
      longitude: Number(dto.longitude),
      category: dto.category.trim(),
    });
  }
}
