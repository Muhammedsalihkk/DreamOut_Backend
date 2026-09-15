import { ISpotRepository } from '../../../domain/repositories/spot.repository';
import { SpotResponseDTO } from '../../dtos/spot.dto';

export class GetSpotsUseCase {
  constructor(private spotRepository: ISpotRepository) {}

  async execute(): Promise<SpotResponseDTO[]> {
    return this.spotRepository.findAll();
  }
}
