import { Application, Router } from 'express';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { createUserController } from './controllers/CreateUserController';

export function registerUserRoutes(app: Application) {
  const router = Router();

  const userRepository = new PrismaUserRepository();
  const createUser = new createUserController(userRepository);

  router.post('/create', (req, res, next) => createUser.execute(req, res, next));

  app.use('/users', router);
}
