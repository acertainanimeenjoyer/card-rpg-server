const Campaign = require('../models/Campaign');

exports.getAllCampaigns = async (req, res) => {
    const campaigns = await Campaign.find().populate('author');
    res.json(campaigns);
};

exports.createCampaign = async (req, res) => {
    const newCampaign = new Campaign({
        ...req.body,
        author: req.user.id
    });
    await newCampaign.save();
    res.status(201).json(newCampaign);
};
