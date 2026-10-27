import { IJourneyRepository } from '../../../domain/repositories/journey.repository';
import { Journey } from '../../../domain/entities/journey.entity';

export class GetUserJourneysUseCase {
  constructor(private journeyRepository: IJourneyRepository) {}

  async execute(userId: number): Promise<Journey[]> {
    return this.journeyRepository.findAllByUser(userId);
  }
}
