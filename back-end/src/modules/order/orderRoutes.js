import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth.js";
import {
  addToCart,
  buyNowCustomizedShawl,
  checkout,
  getAllOrderByUserId,
  getAllOrders,
  getCart,
  removeCartItem,
  updateCartItem,
  updateOrder,
} from "./orderController.js";

import upload from "../../middlewares/fileUpload.js";

const orderRouter = Router();

orderRouter.use(authenticateToken);

orderRouter.route("/").get(getAllOrders);

orderRouter
  .route("/cart")
  .post(upload.single("customizedImage"), addToCart)
  .get(getCart);

orderRouter
  .route("/buy-now")
  .post(upload.single("customizedImage"), buyNowCustomizedShawl);

orderRouter.route("/cart/checkout").post(checkout);

orderRouter.route("/user/:userId").get(getAllOrderByUserId);

orderRouter.route("/cart/:itemId").patch(updateCartItem).delete(removeCartItem);

orderRouter.route("/:orderId").patch(updateOrder);

export default orderRouter;
