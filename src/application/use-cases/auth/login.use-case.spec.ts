import { LoginUseCase } from './login.use-case';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { BadRequestError, UnauthorizedError } from '../../../domain/errors/domain.error';
import { PasswordService } from '../../../infrastructure/security/password.service';
import { JwtService } from '../../../infrastructure/security/jwt.service';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    loginUseCase = new LoginUseCase(mockUserRepository);
  });

  it('should throw BadRequestError if email is missing', async () => {
    await expect(loginUseCase.execute({ email: '', password: 'password123' })).rejects.toThrow(
      BadRequestError,
    );
  });

  it('should throw BadRequestError if password is missing', async () => {
    await expect(loginUseCase.execute({ email: 'test@example.com', password: '' })).rejects.toThrow(
      BadRequestError,
    );
  });

  it('should throw UnauthorizedError if user does not exist', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      loginUseCase.execute({ email: 'nonexistent@example.com', password: 'password123' }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if password is incorrect', async () => {
    const hashedPassword = await PasswordService.hash('correctPassword');
    mockUserRepository.findByEmail.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      name: 'Test User',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      loginUseCase.execute({ email: 'user@example.com', password: 'wrongPassword' }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return auth response with token and sanitized user on successful login', async () => {
    const hashedPassword = await PasswordService.hash('correctPassword');
    mockUserRepository.findByEmail.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      name: 'Test User',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await loginUseCase.execute({
      email: 'user@example.com',
      password: 'correctPassword',
    });

    expect(result).toHaveProperty('token');
    expect(typeof result.token).toBe('string');
    expect(result.user).toEqual({
      id: 1,
      email: 'user@example.com',
      name: 'Test User',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect((result.user as any).password).toBeUndefined();
  });
});
