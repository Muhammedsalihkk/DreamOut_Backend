import { IJourneyRepository, UpdateJourneyProgressData } from '../../../domain/repositories/journey.repository';
import { Journey } from '../../../domain/entities/journey.entity';
import { BadRequestError, NotFoundError } from '../../../domain/errors/domain.error';

export class UpdateJourneyProgressUseCase {
  constructor(private journeyRepository: IJourneyRepository) {}

  async execute(journeyId: number, data: UpdateJourneyProgressData): Promise<Journey> {
    if (!journeyId) {
      throw new BadRequestError('Journey ID is required');
    }
    const journey = await this.journeyRepository.findById(journeyId);
    if (!journey) {
      throw new NotFoundError('Journey', journeyId);
    }
    return this.journeyRepository.updateProgress(journeyId, data);
  }
}
