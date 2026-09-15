import { IUserRepository } from '../../../domain/repositories/user.repository';
import { UserResponseDTO } from '../../dtos/user.dto';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number): Promise<UserResponseDTO> {
    return this.userRepository.delete(id);
  }
}
