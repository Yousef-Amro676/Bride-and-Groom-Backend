// ─────────────────────────────────────────────
//  controllers/orderController.js
//  Full CRUD for Orders + user-specific orders
// ─────────────────────────────────────────────

const Order = require('../models/Order');

// ── GET /api/orders (admin — all orders)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email') // Replace user ID with name & email
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/orders/:id (single order)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/orders/user/:userId (orders for one user)
const getOrdersByUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/orders (place a new order)
const createOrder = async (req, res, next) => {
  try {
    const { user, items, eventDate, notes, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('Order must contain at least one item');
    }

    // Calculate total automatically from items
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user,
      items,
      totalAmount,
      eventDate,
      notes,
      shippingAddress,
    });

    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/orders/:id (update status — admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true, runValidators: true }
    );

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    res.status(200).json({ success: true, message: 'Order updated', data: order });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/orders/:id
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    res.status(200).json({ success: true, message: 'Order deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
