import { IJourneyRepository } from '../../../domain/repositories/journey.repository';
import { Journey } from '../../../domain/entities/journey.entity';
import { NotFoundError } from '../../../domain/errors/domain.error';

export class GetJourneyUseCase {
  constructor(private journeyRepository: IJourneyRepository) {}

  async execute(journeyId: number): Promise<Journey> {
    const journey = await this.journeyRepository.findById(journeyId);
    if (!journey) {
      throw new NotFoundError('Journey', journeyId);
    }
    return journey;
  }
}
