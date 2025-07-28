const Card = require('../models/Card');
const PlayerState = require('../models/PlayerState');
const Enemy = require('../models/Enemy');
const SavedGame = require('../models/SavedGame');

exports.startGame = async (req, res) => {
    res.send("Start game - logic coming soon");
};

exports.playTurn = async (req, res) => {
  const { selectedCards, playerStats, enemyId } = req.body;

  try {
    const enemy = await Enemy.findById(enemyId).populate('moveSet');
    if (!enemy) {
      return res.status(404).json({ error: "Enemy not found" });
    }

    const playerSpeed = playerStats.speed || 0;
    const enemySpeed = enemy.stats.speed || 0;
    let first = playerSpeed >= enemySpeed ? 'player' : 'enemy';

    let hasGuard = false;
    let hasShield = false;
    let totalDamage = 0;
    let enemyDamage = 0;

    // Analyze player's card types
    let physicalCount = 0;
    let supernaturalCount = 0;
    selectedCards.forEach(card => {
      if (card.type === 'Attack') {
        if (card.scaling === 'Physical') physicalCount++;
        if (card.scaling === 'Supernatural') supernaturalCount++;
      }
    });

    // 🧟 Choose best enemy card
    let enemyAttackCard = null;
    if (physicalCount > supernaturalCount) {
      enemyAttackCard = enemy.moveSet.find(c => c.scaling === 'Physical' && c.type === 'Attack');
    } else if (supernaturalCount > physicalCount) {
      enemyAttackCard = enemy.moveSet.find(c => c.scaling === 'Supernatural' && c.type === 'Attack');
    }
    if (!enemyAttackCard) {
      enemyAttackCard = enemy.moveSet.find(c => c.type === 'Attack');
    }

    // Turn Order Execution
    if (first === 'player') {
      // Player's Turn
      for (let card of selectedCards) {
        if (card.type === 'Attack') {
          const scale = playerStats[card.scaling?.toLowerCase() + 'Power'] || 1;
          const dmg = Math.floor(playerStats.attackPower * scale * (card.potency / 100));
          totalDamage += dmg;
        } else if (card.type === 'Buff') {
          if (card.name === 'Guard') hasGuard = true;
          if (card.name === 'Flame Shield') hasShield = true;
        }
      }
      enemy.hp = Math.max(enemy.hp - totalDamage, 0);

      if (enemy.hp > 0 && enemyAttackCard) {
        const scale = enemy.stats[enemyAttackCard.scaling?.toLowerCase() + 'Power'] || 1;
        const base = Math.floor(enemy.stats.attackPower * scale * (enemyAttackCard.potency / 100));
        enemyDamage = hasShield ? 0 : hasGuard ? Math.floor(base / 2) : base;
        playerStats.currentHp = Math.max(playerStats.currentHp - enemyDamage, 0);
      }

    } else {
      // Enemy's Turn
      if (enemyAttackCard) {
        const scale = enemy.stats[enemyAttackCard.scaling?.toLowerCase() + 'Power'] || 1;
        const base = Math.floor(enemy.stats.attackPower * scale * (enemyAttackCard.potency / 100));
        enemyDamage = hasShield ? 0 : hasGuard ? Math.floor(base / 2) : base;
        playerStats.currentHp = Math.max(playerStats.currentHp - enemyDamage, 0);
      }

      if (playerStats.currentHp > 0) {
        for (let card of selectedCards) {
          if (card.type === 'Attack') {
            const scale = playerStats[card.scaling?.toLowerCase() + 'Power'] || 1;
            const dmg = Math.floor(playerStats.attackPower * scale * (card.potency / 100));
            totalDamage += dmg;
          } else if (card.type === 'Buff') {
            if (card.name === 'Guard') hasGuard = true;
            if (card.name === 'Flame Shield') hasShield = true;
          }
        }
        enemy.hp = Math.max(enemy.hp - totalDamage, 0);
      }
    }

    res.json({
      result: {
        player: {
          damageTaken: enemyDamage,
          hpRemaining: Math.max(playerStats.currentHp, 0)
        },
        enemy: {
          damageTaken: totalDamage,
          hpRemaining: Math.max(enemy.hp, 0)
        },
        initiative: first
      }
    });

  } catch (err) {
    console.error("Error in playTurn:", err);
    res.status(500).json({ error: 'Battle failed' });
  }
};

exports.saveState = async (req, res) => {
  try {
    const { playerStats, enemy, deck, hand, selectedCards } = req.body;

    const save = new SavedGame({
      playerStats,
      enemy,
      deck,
      hand,
      selectedCards
    });

    await save.save();
    res.json({ message: "Game saved successfully" });
  } catch (err) {
    console.error("Save failed:", err);
    res.status(500).json({ error: "Failed to save game" });
  }
};
exports.loadState = async (req, res) => {
  try {
    const save = await SavedGame.findOne().sort({ createdAt: -1 }); // get latest save
    if (!save) return res.status(404).json({ error: "No saved game found" });

    res.json(save);
  } catch (err) {
    console.error("Load failed:", err);
    res.status(500).json({ error: "Failed to load game" });
  }
};


