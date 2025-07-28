const mongoose = require('mongoose');

const SavedGameSchema = new mongoose.Schema({
  playerStats: { type: Object, required: true },
  enemy: { type: Object, required: true },
  deck: { type: Array, required: true },
  hand: { type: Array, required: true },
  selectedCards: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedGame', SavedGameSchema);
