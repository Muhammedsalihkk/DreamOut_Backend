import { IUserRepository } from '../../../domain/repositories/user.repository';
import { UserResponseDTO, sanitizeUser } from '../../dtos/user.dto';

export class GetUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map(sanitizeUser);
  }
}
