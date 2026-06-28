 const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders, getOrderDetails } = require('../controllers/orderController');

router.post('/', placeOrder);
router.get('/:user_id', getUserOrders);
router.get('/details/:order_id', getOrderDetails);

module.exports = router;
