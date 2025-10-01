import { Application, Router } from 'express';
import { createUserController } from './controllers/CreateUserController';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';

export function registerUserRoutes(app: Application) {
  const router = Router();

  const userRepository = new PrismaUserRepository();
  const createUser = new createUserController(userRepository);

  router.post('/create', (req, res) => createUser.execute(req, res));

  app.use('/users', router);
}
