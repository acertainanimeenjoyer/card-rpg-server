const mongoose = require('mongoose');

const EnemySchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    stats: {
        attackPower: Number,
        physicalPower: Number,
        supernaturalPower: Number,
        durability: Number,
        vitality: Number,
        intelligence: Number,
        speed: Number
    },
    moveSet: [mongoose.Schema.Types.ObjectId], // reference to Card
    description: String,
    behaviorType: { type: String, enum: ['Aggressive', 'Defensive', 'Random'] }
});

module.exports = mongoose.model('Enemy', EnemySchema);
