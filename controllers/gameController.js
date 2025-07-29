// server/controllers/gameController.js
const mongoose  = require('mongoose');
const Enemy     = require('../models/Enemy');
const SavedGame = require('../models/SavedGame');

// ——— Start a brand‐new game (stub) ———
exports.startGame = async (req, res) => {
  // You can replace this with real initialization logic later
  return res.json({ message: 'startGame placeholder' });
};

// ——— Play one turn of battle ———
exports.playTurn = async (req, res) => {
  console.log('🔍 [playTurn] request body:', JSON.stringify(req.body, null, 2));
  console.log('🔵 [playTurn] Received body:', req.body);

  try {
    const { selectedCards, playerStats, enemyId, enemy: enemyPayload } = req.body;

    // 1) Validate payload
    if (
      !Array.isArray(selectedCards) ||
      typeof playerStats !== 'object' ||
      (!enemyId && typeof enemyPayload !== 'object')
    ) {
      return res.status(400).json({
        error: 'Invalid payload. Provide selectedCards:Array, playerStats:Object, and either enemyId:string or enemy:Object'
      });
    }

    // 2) Load or accept enemy
    let enemy;
    if (enemyId) {
      if (!mongoose.Types.ObjectId.isValid(enemyId)) {
        return res.status(404).json({ error: 'Enemy not found (invalid ID)' });
      }
      const doc = await Enemy.findById(enemyId).populate('moveSet');
      if (!doc) return res.status(404).json({ error: 'Enemy not found' });
      enemy = doc.toObject();
    } else {
      enemy = { ...enemyPayload };
    }

    // 3) Determine initiative
    const playerSpeed = playerStats.speed || 0;
    const enemySpeed  = enemy.stats?.speed || 0;
    const first       = playerSpeed >= enemySpeed ? 'player' : 'enemy';

    // 4) Prepare battle trackers
    let hasGuard    = false;
    let hasShield   = false;
    let totalDamage = 0;
    let enemyDamage = 0;

    // 5) Simple AI counters
    let physCount = 0, magCount = 0;
    for (const c of selectedCards) {
      if (c.type === 'Attack') {
        if (c.scaling === 'Physical')     physCount++;
        if (c.scaling === 'Supernatural') magCount++;
      }
    }
    let counter = Array.isArray(enemy.moveSet)
      ? (
          physCount > magCount
            ? enemy.moveSet.find(m => m.type === 'Attack' && m.scaling === 'Physical')
          : magCount > physCount
            ? enemy.moveSet.find(m => m.type === 'Attack' && m.scaling === 'Supernatural')
          : null
        ) || enemy.moveSet.find(m => m.type === 'Attack')
      : null;

    const calcDmg = (atk, scale, pot) =>
      Math.floor(atk * (scale || 1) * (pot / 100));

    // 6) Execute turns
    if (first === 'player') {
      // — Player's attack —
      for (const c of selectedCards) {
        if (c.type === 'Attack') {
          const scale = playerStats[c.scaling.toLowerCase() + 'Power'];
          totalDamage += calcDmg(playerStats.attackPower, scale, c.potency);
        } else if (c.name === 'Guard') {
          hasGuard = true;
        } else if (c.name === 'Flame Shield') {
          hasShield = true;
        }
      }
      enemy.hp = Math.max(enemy.hp - totalDamage, 0);

      // — Enemy counter —
      if (enemy.hp > 0 && counter) {
        const scale = enemy.stats[counter.scaling.toLowerCase() + 'Power'];
        const base  = calcDmg(enemy.stats.attackPower, scale, counter.potency);
        enemyDamage = hasShield
          ? 0
          : hasGuard
            ? Math.floor(base / 2)
            : base;
        playerStats.currentHp = Math.max(playerStats.currentHp - enemyDamage, 0);
      }

    } else {
      // — Enemy goes first —
      if (counter) {
        const scale = enemy.stats[counter.scaling.toLowerCase() + 'Power'];
        const base  = calcDmg(enemy.stats.attackPower, scale, counter.potency);
        enemyDamage = hasShield
          ? 0
          : hasGuard
            ? Math.floor(base / 2)
            : base;
        playerStats.currentHp = Math.max(playerStats.currentHp - enemyDamage, 0);
      }
      // — Player follows up —
      if (playerStats.currentHp > 0) {
        for (const c of selectedCards) {
          if (c.type === 'Attack') {
            const scale = playerStats[c.scaling.toLowerCase() + 'Power'];
            totalDamage += calcDmg(playerStats.attackPower, scale, c.potency);
          } else if (c.name === 'Guard') {
            hasGuard = true;
          } else if (c.name === 'Flame Shield') {
            hasShield = true;
          }
        }
        enemy.hp = Math.max(enemy.hp - totalDamage, 0);
      }
    }

    // 7) Return results
    return res.json({
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
  }
  catch (err) {
    console.error('🔴 [playTurn] error:', err);
    return res.status(500).json({ error: 'Battle failed' });
  }
};

// ——— Save full game state ———
exports.saveState = async (req, res) => {
  try {
    const {
      playerStats,
      enemy,
      deck,
      hand,
      selectedCards,
      discardPile,
      campaign,
      roomIndex,
      gold
    } = req.body;

    const save = new SavedGame({
      playerStats,
      enemy,
      deck,
      hand,
      selectedCards,
      discardPile,
      campaign,
      roomIndex,
      gold
    });
    await save.save();
    return res.json({ message: "Game saved successfully" });
  } catch (err) {
    console.error("❌ Save failed:", err);
    return res.status(500).json({ error: "Failed to save game" });
  }
};

// ——— Load last saved state ———
exports.loadState = async (req, res) => {
  try {
    const save = await SavedGame.findOne().sort({ createdAt: -1 });
    if (!save) {
      return res.status(404).json({ error: "No saved game found" });
    }
    return res.json(save);
  } catch (err) {
    console.error("❌ Load failed:", err);
    return res.status(500).json({ error: "Failed to load game" });
  }
};
