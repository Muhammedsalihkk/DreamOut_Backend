import { IJourneyRepository, AddJourneyMomentData } from '../../../domain/repositories/journey.repository';
import { JourneyMoment } from '../../../domain/entities/journey.entity';
import { BadRequestError, NotFoundError } from '../../../domain/errors/domain.error';

export class AddJourneyMomentUseCase {
  constructor(private journeyRepository: IJourneyRepository) {}

  async execute(journeyId: number, data: AddJourneyMomentData): Promise<JourneyMoment> {
    if (!journeyId) {
      throw new BadRequestError('Journey ID is required');
    }
    const journey = await this.journeyRepository.findById(journeyId);
    if (!journey) {
      throw new NotFoundError('Journey', journeyId);
    }
    return this.journeyRepository.addMoment(journeyId, data);
  }
}
