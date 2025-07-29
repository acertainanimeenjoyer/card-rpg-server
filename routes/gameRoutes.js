// server/routes/gameRoutes.js
const express = require('express');
const router  = express.Router();

// pull in your four controller functions
const {
  startGame,
  playTurn,
  saveState,
  loadState
} = require('../controllers/gameController');

// requireToken if you want auth on certain routes
// const verifyToken = require('../middleware/authMiddleware');

router.post('/start',   /* verifyToken, */ startGame);
router.post('/play',    /* verifyToken, */ playTurn);
router.post('/save',    /* verifyToken, */ saveState);
router.get( '/load',    /* verifyToken, */ loadState);

module.exports = router;
