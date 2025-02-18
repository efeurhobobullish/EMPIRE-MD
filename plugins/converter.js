const { cmd } = require('../command');
const axios = require('axios');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson, tourl } = require('../Lib/functions');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "toimage",
    desc: "Convert sticker to image.",
    category: "converter",
    filename: __filename
}, async (conn, mek, m, { quoted, reply }) => {
    try {
        if (!quoted) return reply("❌ Please reply to a sticker!");
        if (quoted.type !== 'stickerMessage') return reply("❌ Only stickers can be converted to images!");

        const buff = await quoted.getbuff;
        await conn.sendMessage(m.chat, { image: buff });

    } catch (e) {
        console.error(e);
        reply("❌ An error occurred!");
    }
});


cmd({
    pattern: "tiny",
    desc: "Makes URL tiny.",
    category: "converter",
    use: "<url>",
    filename: __filename,
},
async (conn, mek, m, { from, quoted, isOwner, isAdmins, reply, args }) => {
    if (!args[0]) return reply("Provide me a link");

    try {
        const link = args[0];
        const response = await axios.get(`https://tinyurl.com/api-create.php?url=${link}`);
        const shortenedUrl = response.data;

        return reply(`*🛡️Your Shortened URL*\n\n${shortenedUrl}`);
    } catch (e) {
        console.error(e);
        return reply("An error occurred while shortening the URL. Please try again.");
    }
});
