import { ISpotRepository } from '../../../domain/repositories/spot.repository';
import { CreateSpotDTO, SpotResponseDTO } from '../../dtos/spot.dto';
import { BadRequestError } from '../../../domain/errors/domain.error';

export class CreateSpotUseCase {
  constructor(private spotRepository: ISpotRepository) {}

  async execute(dto: CreateSpotDTO, fallbackUserId?: number): Promise<SpotResponseDTO> {
    const userId = dto.userId || fallbackUserId || 0;

    if (!dto.name || typeof dto.name !== 'string' || dto.name.trim().length === 0) {
      throw new BadRequestError('Spot name is required and must be a non-empty string');
    }
    if (dto.name.trim().length > 150) {
      throw new BadRequestError('Spot name must not exceed 150 characters');
    }
    if (!dto.category || typeof dto.category !== 'string' || dto.category.trim().length === 0) {
      throw new BadRequestError('Spot category is required and must be a non-empty string');
    }
    if (dto.category.trim().length > 50) {
      throw new BadRequestError('Spot category must not exceed 50 characters');
    }

    let lat = 10.0889;
    if (dto.latitude !== undefined && dto.latitude !== null) {
      const parsedLat = Number(dto.latitude);
      if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
        throw new BadRequestError('Latitude must be a valid number between -90 and 90');
      }
      lat = parsedLat;
    }

    let lng = 77.0595;
    if (dto.longitude !== undefined && dto.longitude !== null) {
      const parsedLng = Number(dto.longitude);
      if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
        throw new BadRequestError('Longitude must be a valid number between -180 and 180');
      }
      lng = parsedLng;
    }

    return this.spotRepository.create({
      userId,
      name: dto.name.trim(),
      description: dto.description ? dto.description.trim() : null,
      image: dto.image ? dto.image.trim() : null,
      location: dto.location ? dto.location.trim() : 'Munnar, Idukki',
      latitude: lat,
      longitude: lng,
      category: dto.category.trim(),
    });
  }
}
