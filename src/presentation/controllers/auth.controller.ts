import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case';

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private createUserUseCase?: CreateUserUseCase,
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.loginUseCase.execute(req.body);
      res.status(200).json({
        statusCode: 200,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!this.createUserUseCase) {
        throw new Error('CreateUserUseCase is not configured');
      }
      const user = await this.createUserUseCase.execute(req.body);
      res.status(201).json({
        statusCode: 201,
        message: 'User registered successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}
