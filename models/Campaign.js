const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: String,
    rooms: [{
        roomType: { type: String, enum: ['Attacker', 'Loot', 'Merchant', 'Event'] },
        enemies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enemy' }],
        lootTable: [String], // just a list of item names
        events: [String] // simple text or effect ID
    }]
});

module.exports = mongoose.model('Campaign', CampaignSchema);
