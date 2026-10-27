import { IJourneyRepository } from '../../../domain/repositories/journey.repository';
import { Journey } from '../../../domain/entities/journey.entity';
import { BadRequestError } from '../../../domain/errors/domain.error';

export class StartJourneyUseCase {
  constructor(private journeyRepository: IJourneyRepository) {}

  async execute(userId: number, routeId: number): Promise<Journey> {
    if (!routeId || isNaN(routeId)) {
      throw new BadRequestError('Valid routeId is required to start a journey');
    }
    const existing = await this.journeyRepository.findActiveByUserAndRoute(userId, routeId);
    if (existing) {
      return existing;
    }
    return this.journeyRepository.start({ userId, routeId });
  }
}
