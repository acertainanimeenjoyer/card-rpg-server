const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rarity: { type: String, enum: ['N', 'R', 'G'], default: 'N' },
    unique: { type: Boolean, default: false },
    type: { type: String, enum: ['Attack', 'Buff', 'Debuff', 'Utility'] },
    scaling: { type: String, enum: ['Physical', 'Supernatural'] },
    potency: Number,
    defense: Number,
    effect: String,
    description: String,
    imageUrl: String,
    power: Number // for negation hierarchy
});

module.exports = mongoose.model('Card', CardSchema);
