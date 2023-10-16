import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { EventRoutes } from '../modules/event/event.route';
import { BookingRoutes } from '../modules/booking/booking.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { BlogRoutes } from '../modules/blog/blog.route';
import { FaqRoutes } from '../modules/faq/faq.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/events',
    route: EventRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/faq',
    route: FaqRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
