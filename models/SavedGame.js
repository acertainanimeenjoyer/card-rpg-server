// server/models/SavedGame.js
const mongoose = require('mongoose');

const SavedGameSchema = new mongoose.Schema({
  playerStats:   { type: Object, required: true },
  enemy:         { type: Object, required: true },
  deck:          { type: [Object], required: true },
  hand:          { type: [Object], required: true },
  selectedCards: { type: [Object], default: [] },
  discardPile:   { type: [Object], default: [] },
  campaign:      { type: [Object], default: [] },
  roomIndex:     { type: Number,    default: 0 },
  gold:          { type: Number,    default: 0 },
  createdAt:       { type: Date,   default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('SavedGame', SavedGameSchema);
