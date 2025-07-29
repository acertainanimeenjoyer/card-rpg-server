// server/controllers/campaignController.js

const { generateDefaultCampaign } = require('../utils/campaignGenerator');
const Campaign = require('../models/Campaign'); // if you have a Campaign model

/**
 * GET /api/campaigns/default?length=8
 * Returns a procedurally generated default campaign
 */
exports.getDefaultCampaign = (req, res) => {
  const length = parseInt(req.query.length, 10) || 8;
  const campaign = generateDefaultCampaign(length);
  res.json({ campaign });
};

// Existing CRUD handlers (if any)
exports.getAllCampaigns = async (req, res) => {
  const all = await Campaign.find();
  res.json(all);
};

exports.createCampaign = async (req, res) => {
  const data = req.body;
  const camp = new Campaign(data);
  await camp.save();
  res.status(201).json(camp);
};
