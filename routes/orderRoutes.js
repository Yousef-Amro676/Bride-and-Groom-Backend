// ─────────────────────────────────────────────
//  routes/orderRoutes.js
//  CRUD endpoints for orders
// ─────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const {
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

// GET  /api/orders          → all orders (admin)
// POST /api/orders          → place a new order (user)
router.route('/')
  .get(getAllOrders)
  .post(createOrder);

// GET /api/orders/user/:userId  → all orders for one user
router.get('/user/:userId', getOrdersByUser);

// GET    /api/orders/:id    → single order
// PUT    /api/orders/:id    → update status (admin)
// DELETE /api/orders/:id    → cancel / delete order
router.route('/:id')
  .get(getOrderById)
  .put(updateOrderStatus)
  .delete(deleteOrder);

module.exports = router;
