//---------------------------------------------
//           EMPIRE-MD  
//---------------------------------------------
//  @project_name : EMPIRE-MD  
//  @author       : efeurhobo  
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------

const config = require('../config');
const { cmd, commands } = require('../command');
const { proto, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { sms,downloadMediaMessage } = require('../Lib/msg');
const fs = require('fs');
const exec = require('child_process');
const path = require('path');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../Lib/functions');
const ownerNumber = [config.OWNER_NUMBER];
const prefix = config.PREFIX;
//--------------------------------------------
//  BLOCK COMMANDS
//--------------------------------------------
cmd({
    pattern: "block",
    desc: "Block a user.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, q, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!mek.quoted) return reply("❌ Please reply to the user you want to block.");

    const user = mek.quoted.sender;
    try {
        await conn.updateBlockStatus(user, 'block');
        reply('🚫 User ' + user + ' blocked successfully.');
    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { text: `❌ Failed to block the user: ${err.message}` }, { quoted: mek });
    }
});
//--------------------------------------------
// UN-BLOCK COMMANDS
//--------------------------------------------
cmd({
    pattern: "unblock",
    desc: "Unblock a user.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, q, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!mek.quoted) return reply("❌ Please reply to the user you want to unblock.");

    const user = mek.quoted.sender;
    try {
        await conn.updateBlockStatus(user, 'unblock');
        reply('✅ User ' + user + ' unblocked successfully.');
    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { text: `❌ Failed to unblock the user: ${err.message}` }, { quoted: mek });
    }
});
//--------------------------------------------
//  OWNER COMMANDS
//--------------------------------------------
cmd({
    pattern: "owner",
    desc: "Sends the owner's VCard.",
    category: "owner",
    filename: __filename,
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const number = config.OWNER_NUMBER || "+2348078582627";
        const name = config.OWNER_NAME || "𝙴𝚖𝚙𝚒𝚛𝚎 𝚃𝚎𝚌𝚑";
        const info = global.botname || "𝙴𝙼𝙿𝙸𝚁𝙴-𝙼𝙳";

        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${info};\nTEL;type=CELL;type=VOICE;waid=${number.replace("+", "")}:${number}\nEND:VCARD`;

        await conn.sendMessage(from, { 
            contacts: { 
                displayName: name, 
                contacts: [{ vcard }] 
            },
            contextInfo: {
    externalAdReply: {
        title: global.botname || "𝙴𝙼𝙿𝙸𝚁𝙴-𝙼𝙳",
        body: "𝙲𝚘𝚗𝚝𝚊𝚌𝚝 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛",
        renderLargerThumbnail: true,
        thumbnailUrl: "https://files.catbox.moe/z7c67w.jpg",
        mediaType: 2,
        sourceUrl: `https://wa.me/${number.replace("+", "")}?text=Hello, I am ${pushname}`
    }
}
        }, { quoted: mek });
    } catch (error) {
        console.error("Error in owner command:", error);
        reply("❌ An error occurred while sending the VCard.");
    }
});
//--------------------------------------------
//  DEVELOPER COMMANDS
//--------------------------------------------
cmd({
    pattern: "developer",
    desc: "Sends the developer VCard.",
    category: "owner",
    filename: __filename,
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const number = global.devs || "2348078582627";
        const name = "𝙴𝚖𝚙𝚒𝚛𝚎 𝚃𝚎𝚌𝚑";
        const info = global.botname || "𝙴𝙼𝙿𝙸𝚁𝙴-𝙼𝙳";

        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${info};\nTEL;type=CELL;type=VOICE;waid=${number.replace("+", "")}:${number}\nEND:VCARD`;

        await conn.sendMessage(from, { 
            contacts: { 
                displayName: name, 
                contacts: [{ vcard }] 
            },
            contextInfo: {
    externalAdReply: {
        title: global.botname || "𝙴𝙼𝙿𝙸𝚁𝙴-𝙼𝙳",
        body: "𝙲𝚘𝚗𝚝𝚊𝚌𝚝 𝚝𝚑𝚎 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛",
        renderLargerThumbnail: true,
        thumbnailUrl: "https://files.catbox.moe/z7c67w.jpg",
        mediaType: 2,
        sourceUrl: `https://wa.me/${number.replace("+", "")}?text=Hello Developer, i am  ${pushname}`
    }
}
        }, { quoted: mek });
    } catch (error) {
        console.error("Error in owner command:", error);
        reply("❌ An error occurred while sending the VCard.");
    }
});
//--------------------------------------------
//  JID COMMANDS
//--------------------------------------------
cmd({
    pattern: "jid",
    desc: "Get the Bot's JID.",
    category: "owner",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    reply(`🤖 *Bot JID:* ${conn.user.id}`);
});
//--------------------------------------------
//  DONATE COMMANDS
//--------------------------------------------
cmd({
    pattern: "aza",
    alias: ["donate"],
    desc: "Get owner details",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, quoted }) => {
    try {
        let madeMenu = `
╭────「 𝙴𝙼𝙿𝙸𝚁𝙴-𝙼𝙳 」────◆  
│ ∘ 𝙽𝚊𝚖𝚎: 𝙴𝚏𝚎𝚞𝚛𝚑𝚘𝚋𝚘 𝙱𝚞𝚕𝚕𝚒𝚜𝚑  
│ ∘ 𝙰𝚌𝚌: 8078582627  
│ ∘ 𝙱𝚊𝚗𝚔: 𝙾𝚙𝚊𝚢  
│ ∘ 𝙽𝚘𝚝𝚎: 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 𝚊𝚏𝚝𝚎𝚛 𝚙𝚊𝚢𝚖𝚎𝚗𝚝 .
╰────────────────────`;

        await conn.sendMessage(from, { 
            image: { 
                url: "https://files.catbox.moe/z7c67w.jpg"
            }, 
            caption: madeMenu 
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: `${e}` }, { quoted: mek });
    }
});
//--------------------------------------------
// SET-PP COMMANDS
//--------------------------------------------
cmd({
    pattern: "setpp",
    desc: "Set bot profile picture.",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!quoted || !quoted.message.imageMessage) return reply("❌ Please reply to an image.");
    try {
        const stream = await downloadContentFromMessage(quoted.message.imageMessage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const mediaPath = path.join(__dirname, `${Date.now()}.jpg`);
        fs.writeFileSync(mediaPath, buffer);

        // Update profile picture with the saved file
        await conn.updateProfilePicture(conn.user.jid, { url: `file://${mediaPath}` });
        reply("🖼️ Profile picture updated successfully!");
    } catch (error) {
        console.error("Error updating profile picture:", error);
        reply(`❌ Error updating profile picture: ${error.message}`);
    }
});
//--------------------------------------------
//  VV COMMANDS
//--------------------------------------------
cmd({
    pattern: "vv",
    desc: "Get view once.",
    category: "owner",
    react: "👀",
    filename: __filename
}, async (conn, mek, m, { isReply, quoted, reply }) => {
    try {
        // Check if the message is a view once message
        if (!m.quoted) return reply("Please reply to a view once message!");

        const qmessage = m.message.extendedTextMessage.contextInfo.quotedMessage;
        
            const mediaMessage = qmessage.imageMessage ||
                                qmessage.videoMessage ||
                                qmessage.audioMessage;
                                
            if (!mediaMessage?.viewOnce) {
              return reply("_Not A VV message")
            }

            try {
            const buff = await m.quoted.getbuff
            const cap = mediaMessage.caption || '';
            
            if (mediaMessage.mimetype.startsWith('image')) {
                  await conn.sendMessage(m.chat, {
                  image: buff,
                 caption: cap
         }); 
            } else if (mediaMessage.mimetype.startsWith('video')) {
              await conn.sendMessage(m.chat, {
                  video: buff,
                 caption: cap
         }); 
            } else if (mediaMessage.mimetype.startsWith('audio')) {
              await conn.sendMessage(m.chat, {
                  audio: buff,
                  ptt: mediaMessage.ptt || false
         }); 
            } else {
              return reply("_*Unkown/Unsupported media*_");
        }
    } catch (error) {
        console.error(error);
        reply(`${error}`)
    }
} catch (e) {
  console.error(e);
        reply(`${e}`);
}
});
//--------------------------------------------
//  VV-2 COMMANDS
//--------------------------------------------
cmd({
    pattern: "vv2",
    desc: "Get view once to owner chat.",
    category: "owner",
    react: "👀",
    filename: __filename
}, async (conn, mek, m, { isReply, quoted, reply }) => {
    try {
        if (!m.quoted) return reply("Please reply to a view once message!");

        const qmessage = m.message.extendedTextMessage.contextInfo.quotedMessage;
        const mediaMessage = qmessage.imageMessage ||
                             qmessage.videoMessage ||
                             qmessage.audioMessage;

        if (!mediaMessage?.viewOnce) {
            return reply("_Not A VV message_");
        }

        try {
            const buff = await m.quoted.getbuff;
            const cap = mediaMessage.caption || '';

            if (mediaMessage.mimetype.startsWith('image')) {
                await conn.sendMessage(`${ownerNumber}@s.whatsapp.net`, {
                    image: buff,
                    caption: cap
                }); 
            } else if (mediaMessage.mimetype.startsWith('video')) {
                await conn.sendMessage(`${ownerNumber}@s.whatsapp.net`, {
                    video: buff,
                    caption: cap
                }); 
            } else if (mediaMessage.mimetype.startsWith('audio')) {
                await conn.sendMessage(`${ownerNumber}@s.whatsapp.net`, {
                    audio: buff,
                    ptt: mediaMessage.ptt || false
                }); 
            } else {
                return reply("_*Unknown/Unsupported media*_");
            }
        } catch (error) {
            console.error(error);
            reply(`${error}`);
        }
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});
//--------------------------------------------
//  SAVE COMMANDS
//--------------------------------------------
cmd({
    pattern: "save",
    desc: "Get status or media message.",
    category: "owner",
    react: "👀",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!quoted) return reply("Please reply to a media message!");

        try {
            const buff = await quoted.getbuff;
            const cap = quoted.msg.caption || '';

            if (quoted.type === 'imageMessage') {
                await conn.sendMessage(`${ownerNumber}@s.whatsapp.net`, {
                    image: buff,
                    caption: cap
                }); 
            } else if (quoted.type === 'videoMessage') {
                await conn.sendMessage(`${ownerNumber}@s.whatsapp.net`, {
                    video: buff,
                    caption: cap
                }); 
            } else if (quoted.type === 'audioMessage') {
                await conn.sendMessage(`${ownerNumber}@s.whatsapp.net`, {
                    audio: buff,
                    ptt: quoted.msg.ptt || false
                }); 
            } else {
                return reply("_*Unknown/Unsupported media*_");
            }
        } catch (error) {
            console.error(error);
            reply(`${error}`);
        }
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});
