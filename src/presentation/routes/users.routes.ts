import { Router } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { PrismaUserRepository } from '../../infrastructure/database/repositories/prisma-user.repository';
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case';
import { GetUsersUseCase } from '../../application/use-cases/users/get-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/users/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.use-case';
import { UsersController } from '../controllers/users.controller';
import { validateCreateUser, validateUpdateUser } from '../validators/user.validator';

const userRepository = new PrismaUserRepository(prisma);
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUsersUseCase = new GetUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

const usersController = new UsersController(
  createUserUseCase,
  getUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
  deleteUserUseCase,
); 

const router = Router();

router.post('/', validateCreateUser, (req, res, next) => usersController.create(req, res, next));
router.get('/', (req, res, next) => usersController.findAll(req, res, next));
router.get('/:id', (req, res, next) => usersController.findOne(req, res, next));
router.patch('/:id', validateUpdateUser, (req, res, next) => usersController.update(req, res, next));
router.delete('/:id', (req, res, next) => usersController.remove(req, res, next));

export default router;
