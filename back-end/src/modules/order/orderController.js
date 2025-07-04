import { StatusCodes } from "http-status-codes";
import {
  asyncErrorHandler,
  createError,
  deleteFile,
  sendSuccessResponse,
} from "../../utils/index.js";
import { Product } from "../product/product.js";
import { Order } from "./Order.js";
import { sendMail } from "../../utils/mail.js";
import { FROM_EMAIL } from "../../config/index.js";
import { logOrder } from "../recommendation/utils.js";
import { User } from "../user/user.js";

// GET /orders/cart
export const getCart = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;

  const cart = await Order.findOne({ user: userId, status: "cart" }).populate([
    {
      path: "orderItems.product",
    },
    {
      path: "user",
      select: "name email phoneNum",
    },
  ]);

  if (!cart) {
    return sendSuccessResponse({ res, data: null, message: "Cart is empty" });
  }

  sendSuccessResponse({
    res,
    data: cart,
    message: "Cart fetched successfully",
  });
});

// POST /orders/cart
export const addToCart = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const customizedImage = req?.file?.filename;
  const { productId, quantity, size, color } = req.body;

  if (!quantity || !size) {
    deleteFile(customizedImage);

    return createError({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "All fields are required",
    });
  }

  if (!customizedImage && (!productId || !color)) {
    deleteFile(customizedImage);

    return createError({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "All fields are required",
    });
  }

  let cart = await Order.findOne({ user: userId, status: "cart" });

  if (!cart) {
    cart = new Order({ user: userId, orderItems: [] });
  }

  // Check if same customized item already exists
  const existingItem = cart.orderItems.find((item) => {
    if (productId) {
      // For normal product
      return (
        item.product?.toString() === productId &&
        item.size === size &&
        item.color === color
      );
    } else if (customizedImage) {
      // For customized product (based on image matching)
      return item.customizedImage === customizedImage && item.size === size;
    }
    return false;
  });

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const newItem = {
      quantity,
      size,
      color,
    };

    if (productId) {
      newItem.product = productId;
    } else if (customizedImage) {
      newItem.price = 1200;
      newItem.customizedImage = customizedImage;
    }

    cart.orderItems.push(newItem);
  }

  await cart.save();

  sendSuccessResponse({ res, data: cart, message: "Item added to cart" });
});

// PATCH /orders/cart/:itemId
export const updateCartItem = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const { itemId } = req.params;
  const { quantity } = req.body;

  const cart = await Order.findOne({ user: userId, status: "cart" });

  if (!cart) {
    return createError({ res, statusCode: 404, message: "Cart not found" });
  }

  const item = cart.orderItems.id(itemId);

  if (!item) {
    return createError({
      res,
      statusCode: 404,
      message: "Cart item not found",
    });
  }

  item.quantity = quantity;

  await cart.save();

  sendSuccessResponse({ res, data: cart, message: "Cart item updated" });
});

// DELETE /orders/cart/:itemId
export const removeCartItem = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const { itemId } = req.params;

  const cart = await Order.findOne({ user: userId, status: "cart" });

  if (!cart) {
    return createError({ res, statusCode: 404, message: "Cart not found" });
  }

  cart.orderItems = cart.orderItems.filter(
    (item) => item._id.toString() !== itemId,
  );
  await cart.save();

  sendSuccessResponse({ res, data: cart, message: "Cart item removed" });
});

// POST /orders/cart/checkout
export const checkout = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;

  const { transactionId = "" } = req.body;

  const cart = await Order.findOne({ user: userId, status: "cart" })
    .populate("user")
    .populate("orderItems.product");

  if (!cart || cart.orderItems.length === 0) {
    return createError({ res, statusCode: 400, message: "Cart is empty" });
  }

  // Update inventory
  for (const item of cart.orderItems) {
    if (!item?.product) continue;

    const product = await Product.findOne({
      _id: item.product?._id,
    });

    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  }

  cart.status = "checkout";
  cart.transactionId = transactionId;

  await Order.findOneAndUpdate(
    { user: userId, status: "cart" },
    {
      status: "checkout",
      transactionId,
    },
  );

  const htmlBody = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${cart.user.name},</p>
    <p>Thank you for your order with <strong>Luxe and Loom</strong>!</p>
    <p>Your order has been successfully placed. Here are your order details:</p>

    <ul>
      ${cart.orderItems
        .map(
          (item) => `
        <li>
          <strong>${
            item?.product?.name || "Customized Shawl"
          }</strong> - Qty: ${item.quantity} - NPR ${
            item?.price || item?.product?.basePrice * item.quantity
          }
        </li>`,
        )
        .join("")}
    </ul>

    <p><strong>Total:</strong> NPR ${cart.total}</p>

    <p>Thank you for shopping with us!<br/>The <strong>Luxe and Loom</strong> Team</p>
  </div>
`;

  sendMail({
    from: FROM_EMAIL,
    to: cart.user.email,
    subject: "Order Confirmation - Luxe and Loom",
    html: htmlBody,
  });

  logOrder(userId, cart._id);

  sendSuccessResponse({ res, data: cart, message: "Checkout successful" });
});

// GET /orders
export const getAllOrders = asyncErrorHandler(async (req, res) => {
  const orders = await Order.find({
    status: "checkout",
  })
    .populate("user", "name email address phoneNum profileImage")
    .populate("orderItems.product", "name basePrice images");

  sendSuccessResponse({
    res,
    data: orders,
    message: "Orders fetched successfully",
  });
});

// GET /orders/user
export const getAllOrderByUserId = asyncErrorHandler(async (req, res) => {
  const userId = req.params.userId;

  const orders = await Order.find({ status: "checkout", user: userId })
    .populate("user", "name email phoneNum")
    .populate("orderItems.product", "name basePrice images");

  sendSuccessResponse({
    res,
    data: orders,
    message: "Orders fetched successfully",
  });
});

// PATCH /orders/:orderId
export const updateOrder = asyncErrorHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    return createError({ res, statusCode: 404, message: "Order not found" });
  }

  Object.assign(order, req.body);

  await order.save();

  sendSuccessResponse({ res, data: order, message: "Order status updated" });
});

// POST /orders/buy-now
export const buyNowCustomizedShawl = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const customizedImage = req?.file?.filename;
  const { quantity, size, transactionId } = req.body;

  if (!customizedImage || !quantity || !size) {
    deleteFile(customizedImage);

    return createError({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "All fields are required",
    });
  }

  const newItem = {
    quantity,
    size,
    price: 1200,
    customizedImage,
  };

  const user = await User.findById(userId);

  let cart = new Order({
    user: userId,
    orderItems: [newItem],
    status: "checkout",
    transactionId,
    deliveryAddress: user.deliveryAddress,
  });

  cart = await cart.save();

  const htmlBody = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${user?.name},</p>
    <p>Thank you for your order with <strong>Luxe and Loom</strong>!</p>
    <p>Your order has been successfully placed. Here are your order details:</p>

    <ul>
      ${cart.orderItems
        .map(
          (item) => `
        <li>
          <strong>${"Customized Shawl"}</strong> - Qty: ${item.quantity} - NPR ${
            item?.price * item.quantity
          }
        </li>`,
        )
        .join("")}
    </ul>

    <p><strong>Total:</strong> NPR ${cart.total}</p>

    <p>Thank you for shopping with us!<br/>The <strong>Luxe and Loom</strong> Team</p>
  </div>
`;

  sendMail({
    from: FROM_EMAIL,
    to: user.email,
    subject: "Order Confirmation - Luxe and Loom",
    html: htmlBody,
  });

  logOrder(userId, cart._id);

  sendSuccessResponse({ res, data: cart, message: "Item added to cart" });
});
