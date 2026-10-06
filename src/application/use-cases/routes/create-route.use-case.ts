import { IRouteRepository } from '../../../domain/repositories/route.repository';
import { CreateRouteDTO, RouteResponseDTO } from '../../dtos/route.dto';
import { BadRequestError } from '../../../domain/errors/domain.error';

export class CreateRouteUseCase {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(dto: CreateRouteDTO, fallbackUserId?: number): Promise<RouteResponseDTO> {
    const userId = dto.userId || fallbackUserId || 6;

    if (!dto.title || dto.title.trim().length === 0) {
      throw new BadRequestError('Route title is required');
    }
    if (dto.title.length > 150) {
      throw new BadRequestError('Route title must not exceed 150 characters');
    }
    if (!dto.category || dto.category.trim().length === 0) {
      throw new BadRequestError('Route category is required');
    }

    return this.routeRepository.create({
      userId,
      title: dto.title.trim(),
      coverImage: dto.coverImage ? dto.coverImage.trim() : null,
      shortDescription: dto.shortDescription ? dto.shortDescription.trim() : null,
      description: dto.description ? dto.description.trim() : dto.shortDescription ? dto.shortDescription.trim() : null,
      location: dto.location ? dto.location.trim() : 'Munnar, Idukki',
      category: dto.category.trim(),
      difficulty: dto.difficulty || 'Moderate',
      visibility: dto.visibility || 'Public',
      distance: dto.distance || null,
      duration: dto.duration || null,
      places: dto.places || [],
      highlights: dto.highlights || [],
    });
  }
}
