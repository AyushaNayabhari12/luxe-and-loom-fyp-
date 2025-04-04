import { Router } from 'express';
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from './productController.js';

import { authenticateToken } from '../../middlewares/auth.js';
import upload from '../../middlewares/fileUpload.js';

const productRouter = Router();

productRouter
  .route('/')
  .get(getAllProducts)
  .post(authenticateToken, upload.any('images'), createProduct);

productRouter.use(authenticateToken);

productRouter
  .route('/:id')
  .patch(upload.any('images'), updateProductById)
  .delete(deleteProductById)
  .get(getProductById);

export default productRouter;

