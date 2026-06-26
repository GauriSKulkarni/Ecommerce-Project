 const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart, clearCart } = require('../controllers/cartController');

router.post('/', addToCart);
router.get('/:user_id', getCart);
router.delete('/:id', removeFromCart);
router.delete('/clear/:user_id', clearCart);

module.exports = router;
