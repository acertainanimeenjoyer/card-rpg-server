const express = require('express');
const router = express.Router();
const { getEnemies, createEnemy, getEnemyById } = require('../controllers/enemyController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', getEnemies);
router.get('/:id', getEnemyById);
router.post('/', verifyToken, createEnemy);

module.exports = router;
