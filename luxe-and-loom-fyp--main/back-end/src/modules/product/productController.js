import {
  asyncErrorHandler,
  createError,
  deleteFile,
  sendSuccessResponse,
} from "../../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { Product } from "./product.js";
import { ApiFeatures } from "../../utils/apiFeature.js";
import { logProductView, logSearch } from "../recommendation/utils.js";

// POST /products
export const createProduct = asyncErrorHandler(async (req, res) => {
  const { name, description, basePrice, stock, category, sizes, colors } =
    req.body;

  const userId = req.userId;

  const images = req.files?.map((file) => file.filename);

  if (
    !name ||
    !description ||
    !basePrice ||
    !category ||
    !images?.length ||
    !colors?.length ||
    !sizes?.length
  ) {
    // Clean up uploaded images if validation fails
    images?.forEach(deleteFile);

    createError({
      message:
        "All required fields must be provided including at least one image",
      statusCode: StatusCodes.BAD_REQUEST,
    });

    return;
  }

  const product = new Product({
    name,
    description,
    basePrice,
    stock,
    category,
    images,
    user: userId,
    sizes,
    colors,
  });

  await product.save();

  sendSuccessResponse({
    res,
    statusCode: StatusCodes.CREATED,
    data: product,
    message: "Product created successfully",
  });
});

// GET /products
export const getAllProducts = asyncErrorHandler(async (req, res) => {
  const { keyword, sizes, colors, price } = req.query;

  const searchQuery = {
    isDeleted: false,
  };

  if (keyword) {
    searchQuery.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ];
  }

  if (sizes) {
    const sizeArray = sizes.split(",");
    searchQuery["sizes"] = { $all: sizeArray };
  }

  if (colors) {
    const colorArray = colors.split(",");
    searchQuery["colors"] = { $all: colorArray };
  }

  if (price) {
    const [min, max] = price.split("-").map(Number);
    searchQuery["basePrice"] = { $gte: min, $lte: max };
  }

  const features = new ApiFeatures(
    Product.find(searchQuery).populate("user", "name"),
    req.query,
  ).paginate();

  const products = await features.query;
  const pagination = await features.getPaginationInfo();

  logSearch(req.userId, keyword);

  sendSuccessResponse({
    res,
    data: {
      products,
      pagination,
    },
    message: "Products fetched successfully",
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
      message: "Product not found",
    });
    return;
  }

  // Log the product view by the user
  logProductView(req.userId, id);

  sendSuccessResponse({
    res,
    data: product,
    message: "Product fetched successfully",
  });
});

// PUT /products/:id
export const updateProductById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  let {
    name,
    description,
    basePrice,
    stock,
    category,
    images = [],
    deletedImages = [],
    sizes,
    colors,
  } = req.body;

  // Ensure images and deletedImages are always arrays
  if (typeof images === "string") {
    images = [images];
  }
  if (typeof deletedImages === "string") {
    deletedImages = [deletedImages];
  }

  const newImages = req.files?.map((file) => file.filename) || [];

  const finalImages = [...newImages, ...images];

  if (!name || !description || !basePrice || !category || !finalImages.length) {
    newImages?.forEach(deleteFile);

    createError({
      message: "All required fields must be provided including images",
      statusCode: StatusCodes.BAD_REQUEST,
    });
    return;
  }

  const product = await Product.findById(id);

  if (!product) {
    createError({
      res,
      statusCode: StatusCodes.NOT_FOUND,
      message: "Product not found",
    });
    return;
  }

  Object.assign(product, {
    name,
    description,
    basePrice,
    stock,
    category,
    images: finalImages,
    sizes,
    colors,
  });

  await product.save();

  if (deletedImages && deletedImages?.length) {
    deletedImages.forEach((image) => {
      const imagePath = `uploads/${image}`;
      deleteFile(imagePath);
    });
  }

  sendSuccessResponse({
    res,
    data: product,
    message: "Product updated successfully",
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
      message: "Product not found",
    });
    return;
  }

  sendSuccessResponse({
    res,
    message: "Product deleted successfully",
  });
});

// GET /products/featured-collection
export const getFeaturedCollection = asyncErrorHandler(async (req, res) => {
  const products = await Product.find({
    isDeleted: false,
  })
    .sort({
      createdAt: -1,
    })
    .limit(3);

  sendSuccessResponse({
    res,
    data: products,
    message: "Featured Collection",
  });
});

// GET /products/similar
export const getSimilarProducts = asyncErrorHandler(async (req, res) => {
  const { category, currentProduct } = req.query;

  let searchQuery = {
    isDeleted: false,
  };

  if (category) {
    searchQuery = {
      ...searchQuery,
      category: {
        $in: category,
      },
    };
  }

  if (currentProduct) {
    searchQuery = {
      ...searchQuery,
      _id: {
        $ne: currentProduct,
      },
    };
  }

  const products = await Product.find(searchQuery)
    .sort({
      createdAt: -1,
    })
    .limit(4);

  sendSuccessResponse({
    res,
    data: products,
    message: "Similar Products",
  });
});
