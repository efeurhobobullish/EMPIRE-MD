const config = require('../config');
const { cmd, commands } = require('../command');
const { proto, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { sms,downloadMediaMessage } = require('../Lib/msg');
const fs = require('fs');
const exec = require('child_process');
const path = require('path');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../Lib/functions');

const prefix = config.PREFIX;

cmd({
    pattern: "block",
    desc: "Block a user.",
    category: "owner",
    react: "🚫",
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

cmd({
    pattern: "unblock",
    desc: "Unblock a user.",
    category: "owner",
    react: "✅",
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

cmd({
    pattern: "owner",
    desc: "Sends the owner's VCard.",
    category: "owner",
    filename: __filename,
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const number = config.OWNER_NUMBER || "+2348078582627";
        const name = config.OWNER_NAME || "Only_one_🥇Empire";
        const info = global.botname || "Empire_X";

        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${info};\nTEL;type=CELL;type=VOICE;waid=${number.replace("+", "")}:${number}\nEND:VCARD`;

        await conn.sendMessage(from, { 
            contacts: { 
                displayName: name, 
                contacts: [{ vcard }] 
            },
            contextInfo: {
    externalAdReply: {
        title: global.botname || "Empire_X",
        body: "Contact the owner",
        renderLargerThumbnail: true,
        thumbnailUrl: "https://files.catbox.moe/z7c67w.jpg",
        mediaType: 2,
        sourceUrl: `https://wa.me/${number.replace("+", "")}?text=Hello Dev, I am ${pushname}`
    }
}
        }, { quoted: mek });
    } catch (error) {
        console.error("Error in owner command:", error);
        reply("❌ An error occurred while sending the VCard.");
    }
});

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


// Owner details (Donation command)
cmd({
    pattern: "aza",
    react: "💵",
    alias: ["donate"],
    desc: "Get owner details",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, quoted }) => {
    try {
        let madeMenu = `
╭━━━〔 Empire_X 〕━━━⬤
┃𖠄│ Name: Efeurhobo Bullish
┃𖠄│ Acc: 8078582627
┃𖠄│ Bank: Opay
┃𖠄│ Note: Send a screenshot after payment 💸
┃𖠄╰──────────────⬤
╰━━━━━━━━━━━━━━━⬤`;

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

cmd({
    pattern: "viewonce",
    desc: "Send viewOnce media as normal image/video",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
    if (!quoted || !quoted.message.viewOnceMessage) {
        return reply("❌ Please reply to a viewOnce message with an image or video.");
    }

    try {
        // Get the media file (image/video) from the viewOnce message
        const media = await downloadMediaMessage(quoted, 'viewonce_media');
        const mediaType = quoted.message.viewOnceMessage.message.imageMessage ? 'image' : 'video';

        // Send the media as normal
        if (mediaType === 'image') {
            conn.sendMessage(m.chat, { image: media, caption: "Here's the image!" }, { quoted: m });
        } else if (mediaType === 'video') {
            conn.sendMessage(m.chat, { video: media, caption: "Here's the video!" }, { quoted: m });
        }
        
        reply("✅ ViewOnce media sent as normal!");

    } catch (error) {
        console.error("Error processing viewOnce message:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

cmd({
    pattern: "save",
    desc: "Save and send back a media file (image, video, or audio).",
    category: "owner",
    filename: __filename,

    async execute(conn, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) {
        // Ensure there is a quoted message or a viewOnce message
        const quotedMessage = quoted || m.quoted;

        if (!quotedMessage) {
            return reply('Please reply to a status message with the media you want to save.');
        }

        const mediaType = quotedMessage.type || (m.quoted ? m.quoted.type : null);

        // Check if the quoted message contains media (image, video, or audio)
        if (mediaType === 'imageMessage' || mediaType === 'videoMessage' || mediaType === 'audioMessage') {
            try {
                // Handle viewOnce messages by checking if the message is a viewOnce type
                const mediaBuffer = await downloadMediaMessage(quotedMessage, 'saved_media_' + Date.now());

                // Send the media back to the user via DM
                if (mediaType === 'imageMessage') {
                    conn.sendMessage(sender, mediaBuffer, MessageType.image, { caption: 'Here is your saved image!' });
                } else if (mediaType === 'videoMessage') {
                    conn.sendMessage(sender, mediaBuffer, MessageType.video, { caption: 'Here is your saved video!' });
                } else if (mediaType === 'audioMessage') {
                    conn.sendMessage(sender, mediaBuffer, MessageType.audio, { ptt: false, mimetype: 'audio/mpeg' });
                }

                // Optionally save the media to disk (if needed)
                // fs.writeFileSync(`saved_${filename}`, mediaBuffer); // Uncomment if you want to save it locally

            } catch (error) {
                console.error(error);
                reply('An error occurred while downloading or sending the media.');
            }
        } else {
            reply('The replied message does not contain any media.');
        }
    }
});
