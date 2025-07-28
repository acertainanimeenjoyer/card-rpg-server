const express = require('express');
const router = express.Router();
const { getAllCampaigns, createCampaign } = require('../controllers/campaignController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', getAllCampaigns);
router.post('/', verifyToken, createCampaign);

module.exports = router;
