const express = require('express');
const router = express.Router();
const {
    startGame, playTurn, saveState
} = require('../controllers/gameController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/start', verifyToken, startGame);
router.post('/turn', verifyToken, playTurn);
router.post('/save', verifyToken, saveState);
router.post('/save', gameController.saveState);
router.get('/load', gameController.loadState);

module.exports = router;
