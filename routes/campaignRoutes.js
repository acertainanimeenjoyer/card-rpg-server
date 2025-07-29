// server/routes/campaignRoutes.js

const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getAllCampaigns,
  createCampaign,
  getDefaultCampaign   // ← we need this
} = require('../controllers/campaignController');

// Public: list user‐created campaigns
router.get('/', getAllCampaigns);

// Protected: submit your own custom campaign
router.post('/', verifyToken, createCampaign);

// **This** is the default “procedural” campaign endpoint:
router.get('/default', getDefaultCampaign);

module.exports = router;
