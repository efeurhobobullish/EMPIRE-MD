const fs = require("fs");
const path = require("path");
const config = require("../config");
const { cmd, commands } = require("../command");
const prefix = config.PREFIX;

cmd({
    pattern: "antidelete",
    desc: "enable or disable antidelete.",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, q, pushname, reply }) => {
    // Check the argument for enabling or disabling the anticall feature
    if (args[0] === "on") {
        config.ANTIDELETE = "true";
        return reply("antidelete feature is now enabled.");
    } else if (args[0] === "off") {
        config.ANTIDELETE = "false";
        return reply("antidelete feature is now disabled.");
    } else {
        return reply(`_example:  .antidelete on_`);
    }
});

cmd({
    pattern: "antideletepm",
    desc: "enable or disable antidelete to your chat.",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, q, pushname, reply }) => {
    // Check the argument for enabling or disabling the anticall feature
    if (args[0] === "on") {
        config.ANTIDELETE_PM = "true";
        return reply("antideletepm  is now enabled.\n deleted messages sent to dm.");
    } else if (args[0] === "off") {
        config.ANTIDELETE_PM = "false";
        return reply("antideletepm feature is now disabled.");
    } else {
        return reply(`_example:  .antideletepm on_`);
    }
});

//--------------------------------------------
//   ANTICALL COMMANDS
//--------------------------------------------
cmd({
    pattern: "anticall",
    desc: "Enable or disable the anticall feature",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    if (!isOwner) return reply("*Owner Only Command*");

    const image = "https://files.catbox.moe/gvg6ww.jpg";

    const infoMess = {
        image: { url: image },
        caption: `> *${global.botname} 𝐀𝐍𝐓𝐈𝐂𝐀𝐋𝐋 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

Reply With:

*1.* To Enable Anticall
*2.* To Disable Anticall

╭────────────────◆  
│ ${global.caption}
╰─────────────────◆`,
        contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363337275149306@newsletter',
                newsletterName: global.botname,
                serverMessageId: 143
            }
        }
    };

    const messageSent = await conn.sendMessage(from, infoMess, { quoted: mek });
    const messageId = messageSent.key.id;

    conn.ev.on("messages.upsert", async (event) => {
        const messageData = event.messages[0];
        if (!messageData.message) return;
        const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
        const isReplyToPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

        if (isReplyToPrompt) {
            await m.react("⬇🔄");
            switch (messageContent) {
                case "1": 
                    config.ANTICALL = "true";
                    saveConfig();
                    return reply("✅ *Anticall feature is now enabled.*");

                case "2": 
                    config.ANTICALL = "false";
                    saveConfig();
                    return reply("✅ *Anticall feature is now disabled.*");

                default:
                    await conn.sendMessage(from, { text: "❌ *Invalid option selected. Please reply with 1 or 2.*" });
            }
        }
    });

    await m.react("✅");
});
//--------------------------------------------
// AUTO_TYPING COMMANDS
//--------------------------------------------
cmd({
    pattern: "autotyping",
    description: "Enable or disable auto-typing feature.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isOwner, reply }) => {
    if (!isOwner) return reply("Only the owner can use this command!");

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
        return reply("Example: .autorecording 'on' or 'off'.");
    }

    config.AUTO_TYPING = status === "on" ? "true" : "false";
    return reply(`Auto typing has been turned ${status}.`);
});
//--------------------------------------------
// ALWAYS_ONLINE COMMANDS
//--------------------------------------------
cmd({
    pattern: "alwaysonline",
    description: "Set bot status to always online or offline.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isOwner, reply }) => {
    if (!isOwner) return reply("Only the owner can use this command!");

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
        return reply("Example: .autorecording 'on' or 'off'.");
    }

    config.ALWAYS_ONLINE = status === "on" ? "true" : "false";
    await conn.sendPresenceUpdate(status === "on" ? "available" : "unavailable", from);
    return reply(`Bot is now ${status === "on" ? "online" : "offline"}.`);
});
//--------------------------------------------
//  AUTO_RECORDING COMMANDS
//--------------------------------------------
cmd({
    pattern: "autorecording",
    description: "Enable or disable auto-recording feature.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isOwner, reply }) => {
    if (!isOwner) return reply("Only the owner can use this command!");

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
        return reply("Example: .autorecording 'on' or 'off'.");
    }

    config.AUTO_RECORDING = status === "on" ? "true" : "false";
    if (status === "on") {
        await conn.sendPresenceUpdate("recording", from);
        return reply("Auto recording is now enabled. Bot is recording...");
    } else {
        await conn.sendPresenceUpdate("available", from);
        return reply("Auto recording has been disabled.");
    }
});
//--------------------------------------------
// AUTO_VIEW_STATUS COMMANDS
//--------------------------------------------
cmd({
    pattern: "autoreadsatus",
    alias: ["avstatus"],
    desc: "Enable or disable auto-viewing of statuses",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, q, pushname, reply }) => {
    // Default value for AUTO_VIEW_STATUS is "false"
    if (args[0] === "true") {
        config.AUTO_VIEW_STATUS = "true";
        return reply("Auto-viewing of statuses is now enabled.");
    } else if (args[0] === "false") {
        config.AUTO_VIEW_STATUS = "false";
        return reply("Auto-viewing of statuses is now disabled.");
    } else {
        return reply(`Example: .autoviewstatus false`);
    }
}); 
//--------------------------------------------
// AUTO_LIKE_STATUS COMMANDS
//--------------------------------------------
cmd({
    pattern: "autolikestatus",
    alias: ["alstatus"],
    desc: "Enable or disable auto-liking of statuses",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, q, pushname, reply }) => {
    // Default value for AUTO_LIKE_STATUS is "false"
    if (args[0] === "true") {
        config.AUTO_LIKE_STATUS = "true";
        return reply("Auto-liking of statuses is now enabled.");
    } else if (args[0] === "false") {
        config.AUTO_LIKE_STATUS = "false";
        return reply("Auto-liking of statuses is now disabled.");
    } else {
        return reply(`Example: .autolikestatus false`);
    }
});
//--------------------------------------------
// AUTO_LIKE_EMOJI COMMANDS
//--------------------------------------------
cmd({
    pattern: "autolikeemoji",
    alias: ["aleemoji"],
    desc: "Set custom emoji for auto-liking statuses",
    category: "settings",
    react: "💜",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, q, pushname, reply }) => {
    // Default value for AUTO_LIKE_EMOJI is "💜"
    if (args[0]) {
        config.AUTO_LIKE_EMOJI = args[0];
        return reply(`Custom emoji for auto-liking statuses set to: ${config.AUTO_LIKE_EMOJI}`);
    } else {
        return reply(`Example: .autolikeemoji 💖`);
    }
});
