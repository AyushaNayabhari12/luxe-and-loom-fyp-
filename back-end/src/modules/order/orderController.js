import { StatusCodes } from 'http-status-codes';
import { Order } from './Order.js';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler.js';
import { sendSuccessResponse } from '../../utils/apiResponseHandler.js';
import { createError } from '../../utils/createError.js';
import { Product } from '../product/product.js';

// GET /orders/cart
export const getCart = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;

  const cart = await Order.findOne({ user: userId, status: 'cart' }).populate({
    path: 'orderItems.product',
  });

  if (!cart) {
    return sendSuccessResponse({ res, data: null, message: 'Cart is empty' });
  }

  sendSuccessResponse({
    res,
    data: cart,
    message: 'Cart fetched successfully',
  });
});

// POST /orders/cart
export const addToCart = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const { productId, quantity, size, color } = req.body;

  if (!productId || !quantity || !size || !color) {
    return createError({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'All fields are required',
    });
  }

  let cart = await Order.findOne({ user: userId, status: 'cart' });

  if (!cart) {
    cart = new Order({ user: userId, orderItems: [] });
  }

  const existingItem = cart.orderItems.find(
    item =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.orderItems.push({ product: productId, quantity, size, color });
  }

  await cart.save();

  sendSuccessResponse({ res, data: cart, message: 'Item added to cart' });
});

// PATCH /orders/cart/:itemId
export const updateCartItem = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const { itemId } = req.params;
  const { quantity } = req.body;

  const cart = await Order.findOne({ user: userId, status: 'cart' });

  if (!cart) {
    return createError({ res, statusCode: 404, message: 'Cart not found' });
  }

  const item = cart.orderItems.id(itemId);

  if (!item) {
    return createError({
      res,
      statusCode: 404,
      message: 'Cart item not found',
    });
  }

  item.quantity = quantity;

  await cart.save();

  sendSuccessResponse({ res, data: cart, message: 'Cart item updated' });
});

// DELETE /orders/cart/:itemId
export const removeCartItem = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const { itemId } = req.params;

  const cart = await Order.findOne({ user: userId, status: 'cart' });

  if (!cart) {
    return createError({ res, statusCode: 404, message: 'Cart not found' });
  }

  cart.orderItems = cart.orderItems.filter(
    item => item._id.toString() !== itemId
  );
  await cart.save();

  sendSuccessResponse({ res, data: cart, message: 'Cart item removed' });
});

// POST /orders/cart/checkout
export const checkout = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;

  const { deliveryAddress, notes = '' } = req.body;

  const cart = await Order.findOne({ user: userId, status: 'cart' });

  if (!cart || cart.orderItems.length === 0) {
    return createError({ res, statusCode: 400, message: 'Cart is empty' });
  }

  // Update inventory
  for (const item of cart.orderItems) {
    const product = await Product.findById(item.product._id.toString());

    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  }

  cart.status = 'shipped';
  cart.deliveryAddress = deliveryAddress;
  cart.notes = notes;
  await cart.save();

  sendSuccessResponse({ res, data: cart, message: 'Checkout successful' });
});

// GET /orders
export const getAllOrders = asyncErrorHandler(async (req, res) => {
  const { status } = req.query;
  const query = status
    ? { status }
    : {
        status: {
          $ne: 'cart',
        },
      };

  const orders = await Order.find(query)
    .populate('user', 'name email address phoneNum profileImage')
    .populate('orderItems.product', 'name basePrice images');

  sendSuccessResponse({
    res,
    data: orders,
    message: 'Orders fetched successfully',
  });
});

// GET /orders/user
export const getAllOrderByUserId = asyncErrorHandler(async (req, res) => {
  const userId = req.params.userId;
  const { status } = req.query;
  const query = status
    ? { status, user: userId }
    : {
        status: {
          $ne: 'cart',
        },
        user: userId,
      };

  const orders = await Order.find(query)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name basePrice images');

  sendSuccessResponse({
    res,
    data: orders,
    message: 'Orders fetched successfully',
  });
});

// PATCH /orders/:orderId/status
export const updateOrderStatus = asyncErrorHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return createError({ res, statusCode: 404, message: 'Order not found' });
  }

  order.status = status;
  await order.save();

  sendSuccessResponse({ res, data: order, message: 'Order status updated' });
});

