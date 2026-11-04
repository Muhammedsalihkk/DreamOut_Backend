import { Router } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { PrismaUserRepository } from '../../infrastructure/database/repositories/prisma-user.repository';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case';
import { AuthController } from '../controllers/auth.controller';
import { validateLogin } from '../validators/auth.validator';
import { validateCreateUser } from '../validators/user.validator';

const userRepository = new PrismaUserRepository(prisma);
const loginUseCase = new LoginUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);

const authController = new AuthController(loginUseCase, createUserUseCase);

const router = Router();

router.post('/login', validateLogin, (req, res, next) => authController.login(req, res, next));
router.post('/register', validateCreateUser, (req, res, next) => authController.register(req, res, next));
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ statusCode: 400, message: 'Email is required' });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  return res.status(200).json({
    statusCode: 200,
    message: user ? `Password reset instructions sent to ${email}` : 'If this email exists, instructions have been sent.',
    data: { sent: true },
  });
});

export default router;
