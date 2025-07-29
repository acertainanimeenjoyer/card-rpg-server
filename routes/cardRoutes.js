const express = require('express');
const router = express.Router();
const { getAllCards, createCard } = require('../controllers/cardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', getAllCards);
router.post('/', verifyToken, createCard);

module.exports = router;
