import { IUserRepository } from '../../../domain/repositories/user.repository';
import { CreateUserDTO, UserResponseDTO, sanitizeUser } from '../../dtos/user.dto';
import { BadRequestError, ConflictError } from '../../../domain/errors/domain.error';
import { PasswordService } from '../../../infrastructure/security/password.service';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    if (!dto.email) {
      throw new BadRequestError('Email is required');
    }

    const normalizedEmail = dto.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictError(`User with email '${normalizedEmail}' already exists`);
    }

    const hashedPassword = dto.password
      ? await PasswordService.hash(dto.password)
      : '';

    const createdUser = await this.userRepository.create({
      email: normalizedEmail,
      name: dto.name,
      password: hashedPassword,
    });

    return sanitizeUser(createdUser);
  }
}
