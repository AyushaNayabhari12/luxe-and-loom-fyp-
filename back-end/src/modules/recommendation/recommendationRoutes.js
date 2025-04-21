import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth.js';
import { getRecommendedProducts } from './recommendationController.js';

export const recommendationRouter = Router();

recommendationRouter.use(authenticateToken);

recommendationRouter.get('/', getRecommendedProducts);

export default recommendationRouter;

