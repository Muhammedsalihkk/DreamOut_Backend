import { IRouteRepository } from '../../../domain/repositories/route.repository';
import { UpdateRouteDTO, RouteResponseDTO } from '../../dtos/route.dto';
import { NotFoundError, BadRequestError } from '../../../domain/errors/domain.error';

export class UpdateRouteUseCase {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(id: number, dto: UpdateRouteDTO): Promise<RouteResponseDTO> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError('Invalid Route ID');
    }

    const existingRoute = await this.routeRepository.findById(id);
    if (!existingRoute) {
      throw new NotFoundError('Route', id);
    }

    if (dto.title !== undefined) {
      if (dto.title.trim().length === 0) {
        throw new BadRequestError('Route title cannot be empty');
      }
      if (dto.title.length > 150) {
        throw new BadRequestError('Route title must not exceed 150 characters');
      }
    }

    return this.routeRepository.update(id, {
      ...(dto.title !== undefined && { title: dto.title.trim() }),
      ...(dto.coverImage !== undefined && { coverImage: dto.coverImage }),
      ...(dto.shortDescription !== undefined && { shortDescription: dto.shortDescription }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.location !== undefined && { location: dto.location }),
      ...(dto.category !== undefined && { category: dto.category.trim() }),
      ...(dto.difficulty !== undefined && { difficulty: dto.difficulty }),
      ...(dto.visibility !== undefined && { visibility: dto.visibility }),
      ...(dto.distance !== undefined && { distance: dto.distance }),
      ...(dto.duration !== undefined && { duration: dto.duration }),
      ...(dto.places !== undefined && { places: dto.places }),
      ...(dto.highlights !== undefined && { highlights: dto.highlights }),
      ...(dto.likesCount !== undefined && { likesCount: dto.likesCount }),
      ...(dto.commentsCount !== undefined && { commentsCount: dto.commentsCount }),
    });
  }
}
