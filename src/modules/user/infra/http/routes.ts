import { Application, Router } from 'express';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { createUserController } from './controllers/CreateUserController';
import { AuthenticateUserController } from './controllers/AuthenticateUserController';

export function registerUserRoutes(app: Application) {
  const router = Router();

  const userRepository = new PrismaUserRepository();
  const createUser = new createUserController(userRepository);
  const authController = new AuthenticateUserController(userRepository);

  router.post('/create', (req, res, next) => createUser.execute(req, res, next));
  router.post('/login', (req, res, next) => authController.execute(req, res));

  app.use('/users', router);
}
