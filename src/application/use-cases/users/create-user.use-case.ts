import { IUserRepository } from '../../../domain/repositories/user.repository';
import { CreateUserDTO, UserResponseDTO } from '../../dtos/user.dto';
import { BadRequestError } from '../../../domain/errors/domain.error';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    if (!dto.email) {
      throw new BadRequestError('Email is required');
    }

    return this.userRepository.create({
      email: dto.email,
      name: dto.name,
    });
  }
}
