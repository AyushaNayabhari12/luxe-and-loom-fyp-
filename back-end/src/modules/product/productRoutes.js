import { Router } from 'express';
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getFeaturedCollection,
  getProductById,
  getSimilarProducts,
  updateProductById,
} from './productController.js';

import { authenticateToken } from '../../middlewares/auth.js';
import upload from '../../middlewares/fileUpload.js';

const productRouter = Router();

productRouter
  .route('/')
  .get(authenticateToken, getAllProducts)
  .post(authenticateToken, upload.any('images'), createProduct);

productRouter.use(authenticateToken);

productRouter.route('/featured-collection').get(getFeaturedCollection);

productRouter.route('/similar').get(getSimilarProducts);

productRouter
  .route('/:id')
  .patch(upload.any('newImages'), updateProductById)
  .delete(deleteProductById)
  .get(getProductById);

export default productRouter;


