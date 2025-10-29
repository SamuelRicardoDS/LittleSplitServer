import { Application, Router } from 'express';

export function registerGroupRoutes(app: Application) {
  const router = Router();

  router.post('/create', (req, res, next) => () => {});

  app.use('/groups', router);
}
