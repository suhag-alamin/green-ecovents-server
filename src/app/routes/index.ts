import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { EventRoutes } from '../modules/event/event.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/events',
    route: EventRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
