const express = require('express');
const router = express.Router();
const { getEnemies, createEnemy } = require('../controllers/enemyController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', getEnemies);
router.post('/', verifyToken, createEnemy);

module.exports = router;
