import { IUserRepository } from '../../../domain/repositories/user.repository';
import { UserResponseDTO, sanitizeUser } from '../../dtos/user.dto';
import { NotFoundError } from '../../../domain/errors/domain.error';

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }
    return sanitizeUser(user);
  }
}
