import { IUserRepository } from '../../../domain/repositories/user.repository';
import { UpdateUserDTO, UserResponseDTO } from '../../dtos/user.dto';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    return this.userRepository.update(id, dto);
  }
}
