import { IRouteRepository } from '../../../domain/repositories/route.repository';
import { RouteResponseDTO } from '../../dtos/route.dto';
import { NotFoundError, BadRequestError } from '../../../domain/errors/domain.error';

export class GetRouteUseCase {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(id: number): Promise<RouteResponseDTO> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError('Invalid Route ID');
    }

    const route = await this.routeRepository.findById(id);
    if (!route) {
      throw new NotFoundError('Route', id);
    }

    return route;
  }
}
