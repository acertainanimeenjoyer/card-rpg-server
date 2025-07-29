const express = require('express');
const router = express.Router();
const {
  getDefaultCampaign,
  getAllCampaigns,
  createCampaign
} = require('../controllers/campaignController');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/campaigns/default?length=8
router.get('/default', getDefaultCampaign);

// GET /api/campaigns
router.get('/', getAllCampaigns);

// POST /api/campaigns (protected)
router.post('/', verifyToken, createCampaign);

module.exports = router;
