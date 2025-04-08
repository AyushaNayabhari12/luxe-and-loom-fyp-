import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth.js';
import {
    getDashboardMetrics,
    getOrdersOverTime,
    getProductCountByCategory,
} from './dashboardController.js';

const dashboardRouter = Router();

dashboardRouter.use(authenticateToken);

dashboardRouter.get('/metrics', getDashboardMetrics);
dashboardRouter.get('/products-by-category', getProductCountByCategory);
dashboardRouter.get('/orders-over-time', getOrdersOverTime);

export default dashboardRouter;

