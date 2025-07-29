const Enemy = require('../models/Enemy');

exports.getEnemies = async (req, res) => {
    const enemies = await Enemy.find();
    res.json(enemies);
};

exports.getEnemyById = async (req, res) => {
  try {
    const enemy = await Enemy.findById(req.params.id);
    if (!enemy) return res.status(404).json({ error: 'Enemy not found' });
    res.json(enemy);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createEnemy = async (req, res) => {
    const enemy = await Enemy.create(req.body);
    res.status(201).json(enemy);
};
