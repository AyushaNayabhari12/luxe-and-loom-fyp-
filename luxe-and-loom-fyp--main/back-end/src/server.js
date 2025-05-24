import cors from "cors";
import express from "express";
import fs from "fs";
import logger from "morgan";

import { PORT, STATIC_FOLDER } from "./config/index.js";
import { connectDB } from "./db/index.js";
import handleError from "./middlewares/globalErrorHandler.js";
import authRouter from "./modules/auth/authRoutes.js";
import dashboardRouter from "./modules/dashboard/dashboardRoutes.js";
import orderRouter from "./modules/order/orderRoutes.js";
import productRouter from "./modules/product/productRoutes.js";
import userRouter from "./modules/user/userRoutes.js";
import recommendationRouter from "./modules/recommendation/recommendationRoutes.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "*" }));
app.use(logger("dev"));

app.use(express.static(STATIC_FOLDER));

app.use("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/dashboard", dashboardRouter);
app.use("/recommendations", recommendationRouter);

app.use(handleError);

try {
  if (!fs.existsSync(STATIC_FOLDER)) {
    fs.mkdirSync(STATIC_FOLDER);
  }
} catch (err) {
  console.error(err);
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
