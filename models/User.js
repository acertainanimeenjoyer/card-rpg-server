const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    savedCampaigns: [mongoose.Schema.Types.ObjectId],
    savedDecks: [mongoose.Schema.Types.ObjectId],
    playerStates: [Object], // Save in-game states
});

module.exports = mongoose.model('User', UserSchema);
