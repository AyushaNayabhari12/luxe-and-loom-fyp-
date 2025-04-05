import {
  asyncErrorHandler,
  createError,
  deleteFile,
  sendSuccessResponse,
} from '../../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { Product } from './product.js';
import { ApiFeatures } from '../../utils/apiFeature.js';

// POST /products
export const createProduct = asyncErrorHandler(async (req, res) => {
  const { name, description, basePrice, stock, category } = req.body;

  const userId = req.userId;

  const images = req.files?.map(file => file.filename);

  if (!name || !description || !basePrice || !category || !images?.length) {
    // Clean up uploaded images if validation fails
    images?.forEach(deleteFile);

    createError({
      message:
        'All required fields must be provided including at least one image',
      statusCode: StatusCodes.BAD_REQUEST,
    });

    return;
  }

  const product = await Product.create({
    name,
    description,
    basePrice,
    stock,
    category,
    images,
    user: userId,
  });

  sendSuccessResponse({
    res,
    statusCode: StatusCodes.CREATED,
    data: product,
    message: 'Product created successfully',
  });
});

// GET /products
export const getAllProducts = asyncErrorHandler(async (req, res) => {
  const { keyword } = req.query;

  const searchQuery = keyword
    ? {
        isDeleted: false,
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { category: { $regex: keyword, $options: 'i' } },
        ],
      }
    : {
        isDeleted: false,
      };

  const features = new ApiFeatures(
    Product.find(searchQuery).populate('user', 'name'),
    req.query
  ).paginate();

  const products = await features.query;

  const pagination = await features.getPaginationInfo();

  // Response
  sendSuccessResponse({
    res,
    data: {
      products,
      pagination,
    },
    message: 'Products fetched successfully',
  });
});

// GET /products/:id
export const getProductById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    createError({
      res,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Product not found',
    });
    return;
  }

  sendSuccessResponse({
    res,
    data: product,
    message: 'Product fetched successfully',
  });
});

// PUT /products/:id
export const updateProductById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    basePrice,
    stock,
    category,
    images = [],
    deletedImages = [],
  } = req.body;

  const newImages = req.files?.map(file => file.filename) || [];
  const finalImages = [...newImages, ...images];

  if (!name || !description || !basePrice || !category || !finalImages.length) {
    newImages?.forEach(deleteFile);

    createError({
      message: 'All required fields must be provided including images',
      statusCode: StatusCodes.BAD_REQUEST,
    });
    return;
  }

  const product = await Product.findByIdAndUpdate(
    id,
    {
      name,
      description,
      basePrice,
      stock,
      category,
      images: finalImages,
    },
    { new: true }
  );

  if (!product) {
    createError({
      res,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Product not found',
    });
    return;
  }

  deletedImages?.forEach(deleteFile);

  sendSuccessResponse({
    res,
    data: product,
    message: 'Product updated successfully',
  });
});

// DELETE /products/:id
export const deleteProductById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, {
    isDeleted: true,
  });

  if (!product) {
    createError({
      res,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Product not found',
    });
    return;
  }

  sendSuccessResponse({
    res,
    message: 'Product deleted successfully',
  });
});

