import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth.js';
import {
  addToCart,
  checkout,
  getAllOrderByUserId,
  getAllOrders,
  getCart,
  removeCartItem,
  updateCartItem,
} from './orderController.js';

const orderRouter = Router();

orderRouter.use(authenticateToken);

orderRouter.route('/').get(getAllOrders);

orderRouter.route('/cart').post(addToCart).get(getCart);

orderRouter.route('/cart/checkout').post(checkout);

orderRouter.route('/checkout').post(checkout);

orderRouter.route('/user/:userId').get(getAllOrderByUserId);

orderRouter.route('/cart/:itemId').patch(updateCartItem).delete(removeCartItem);

orderRouter.route('/:orderId/status').patch(checkout);

export default orderRouter;

