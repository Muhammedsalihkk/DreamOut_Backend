import { IRouteRepository } from '../../../domain/repositories/route.repository';
import { RouteResponseDTO } from '../../dtos/route.dto';

export class GetRoutesUseCase {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(): Promise<RouteResponseDTO[]> {
    return this.routeRepository.findAll();
  }
}
