const mongoose = require('mongoose');

const PlayerStateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    currentCampaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    hp: Number,
    stats: {
        attackPower: Number,
        physicalPower: Number,
        supernaturalPower: Number,
        durability: Number,
        vitality: Number,
        intelligence: Number,
        speed: Number
    },
    currentDeck: [mongoose.Schema.Types.ObjectId], // current playable deck
    inventory: [String],
    position: Number // index in campaign.rooms
});

module.exports = mongoose.model('PlayerState', PlayerStateSchema);
