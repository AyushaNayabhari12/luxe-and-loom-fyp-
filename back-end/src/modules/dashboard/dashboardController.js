import { sendSuccessResponse } from '../../utils/apiResponseHandler.js';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler.js';
import { Order } from '../order/order.js';
import { Product } from '../product/product.js';
import { User } from '../user/user.js';
import dayjs from 'dayjs';

// GET /dashboard/metrics
export const getDashboardMetrics = asyncErrorHandler(async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, revenueResult] =
    await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
          },
        },
      ]),
    ]);

  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  sendSuccessResponse({
    res,
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    },
    message: 'Dashboard metrics fetched successfully',
  });
});

// GET /dashboard/products-by-category
export const getProductCountByCategory = asyncErrorHandler(async (req, res) => {
  const productCountByCategory = await Product.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const formatted = productCountByCategory.map(item => ({
    category: item._id,
    count: item.count,
  }));

  sendSuccessResponse({
    res,
    data: formatted,
    message: 'Product count by category fetched successfully',
  });
});

// GET /dashboard/orders-over-time
export const getOrdersOverTime = asyncErrorHandler(async (req, res) => {
  const startOfYear = dayjs().startOf('year').toDate();
  const endOfYear = dayjs().endOf('year').toDate();

  const orders = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfYear,
          $lte: endOfYear,
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.month': 1 },
    },
  ]);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Ensure all months are present, even with 0 orders
  const monthlyData = months.map((month, idx) => {
    const match = orders.find(o => o._id.month === idx + 1);
    return {
      month,
      count: match?.count || 0,
    };
  });

  sendSuccessResponse({
    res,
    data: monthlyData,
    message: 'Orders over time fetched successfully',
  });
});


