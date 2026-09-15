import { IUserRepository } from '../../../domain/repositories/user.repository';
import { UserResponseDTO } from '../../dtos/user.dto';

export class GetUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<UserResponseDTO[]> {
    return this.userRepository.findAll();
  }
}
