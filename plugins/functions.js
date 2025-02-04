const fs = require('fs');
const path = require('path');
const config = require('../config');
const { isUrl } = require('../Lib/functions');  // Importing the isUrl function
const { cmd, commands } = require('../command');
// List of bad words to check against
const badWords = ["wtf", "mia", "xxx", "fuck", "sex", "huththa", "pakaya", "ponnaya", "hutto", "lol"];

cmd({
  on: "body"
}, async (conn, mek, m, { from, body, isGroup, isAdmins, isBotAdmins, reply, sender }) => {
  try {
    if (!isGroup || isAdmins || !isBotAdmins) return; // Skip if not in group, or sender is admin, or bot is not admin

    const lowerCaseMessage = body.toLowerCase();
    const containsBadWord = badWords.some(word => lowerCaseMessage.includes(word));

    if (containsBadWord && config.ANTI_BAD === 'true') {
      await conn.sendMessage(from, { delete: mek.key });
      await conn.sendMessage(from, { text: "🚫 ⚠️BAD WORDS NOT ALLOWED⚠️ 🚫" });
    }

    // Check for links using the isUrl function
    if (isUrl(body) && config.ANTI_LINK === 'true') {
      await conn.sendMessage(from, { delete: mek.key });
      await conn.sendMessage(from, { text: `⚠️ Links are not allowed in this group.\n@${sender.split('@')[0]} has been removed. 🚫`, mentions: [sender] });
      await conn.groupParticipantsUpdate(from, [sender], 'remove');
    }

  } catch (error) {
    console.error(error);
    reply("An error occurred while processing the message.");
  }
});

// Composing (Auto Typing)
cmd({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    if (config.AUTO_TYPING === 'true') {
        await conn.sendPresenceUpdate('composing', from); // Send typing
    }
});

// Always Online / Available
cmd({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    if (config.ALWAYS_ONLINE === 'true') {
        await conn.sendPresenceUpdate('available', from); // Explicitly show online
    } else {
        await conn.sendPresenceUpdate('unavailable', from); // Explicitly set to offline
    }
});

// Auto Recording
cmd({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    if (config.AUTO_RECORDING === 'true') {
        // Set the bot's presence to "recording"
        await conn.sendPresenceUpdate('recording', from); // Start recording
        // Optionally, you can send a message to notify that recording has started
        await conn.sendMessage(from, 'Bot is now recording...', { quoted: mek });
    }
});
