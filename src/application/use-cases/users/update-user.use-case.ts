import { IUserRepository } from '../../../domain/repositories/user.repository';
import { UpdateUserDTO, UserResponseDTO, sanitizeUser } from '../../dtos/user.dto';
import { ConflictError } from '../../../domain/errors/domain.error';
import { PasswordService } from '../../../infrastructure/security/password.service';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    const updateData = { ...dto };

    if (updateData.email) {
      updateData.email = updateData.email.trim().toLowerCase();
      const existingUser = await this.userRepository.findByEmail(updateData.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictError(`User with email '${updateData.email}' already exists`);
      }
    }

    if (updateData.password) {
      updateData.password = await PasswordService.hash(updateData.password);
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    return sanitizeUser(updatedUser);
  }
}
