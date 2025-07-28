const Enemy = require('../models/Enemy');

exports.getEnemies = async (req, res) => {
    const enemies = await Enemy.find();
    res.json(enemies);
};

exports.createEnemy = async (req, res) => {
    const enemy = await Enemy.create(req.body);
    res.status(201).json(enemy);
};
