// server/utils/campaignGenerator.js

const ROOM_TYPES = ["combat", "loot", "merchant", "event"];

function randomRoom(type, index) {
  switch (type) {
    case "combat":
      return { 
        id: `room-${index}`, 
        type, 
        enemies: [ /* you can add default enemy IDs or stats */ ] 
      };
    case "loot":
      return { 
        id: `room-${index}`, 
        type, 
        lootTable: [ /* default loot definitions */ ] 
      };
    case "merchant":
      return { 
        id: `room-${index}`, 
        type, 
        inventory: [ /* default shop items */ ] 
      };
    case "event":
      return { 
        id: `room-${index}`, 
        type, 
        description: "A mysterious event occurs..." 
      };
    default:
      return { id: `room-${index}`, type: "combat" };
  }
}

/**
 * Generate a default campaign of `length` rooms + final boss room
 */
function generateDefaultCampaign(length = 8) {
  const campaign = [];
  for (let i = 0; i < length; i++) {
    const type = ROOM_TYPES[i % ROOM_TYPES.length];
    campaign.push(randomRoom(type, i));
  }
  // add final boss room
  campaign.push({
    id: `room-${length}`,
    type: "combat",
    boss: true,
    enemies: [ /* boss enemy IDs or stats */ ]
  });
  return campaign;
}

module.exports = { generateDefaultCampaign };
