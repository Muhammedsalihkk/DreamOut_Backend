import { IUserRepository } from '../../../domain/repositories/user.repository';
import { LoginDTO, AuthResponseDTO } from '../../dtos/auth.dto';
import { sanitizeUser } from '../../dtos/user.dto';
import { BadRequestError, UnauthorizedError } from '../../../domain/errors/domain.error';
import { PasswordService } from '../../../infrastructure/security/password.service';
import { JwtService } from '../../../infrastructure/security/jwt.service';

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: LoginDTO): Promise<AuthResponseDTO> {
    if (!dto.email || !dto.email.trim()) {
      throw new BadRequestError('Email is required');
    }

    if (!dto.password) {
      throw new BadRequestError('Password is required');
    }

    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await PasswordService.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = JwtService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: sanitizeUser(user),
    };
  }
}
