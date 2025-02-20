const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../Lib/functions');


cmd({ 
    pattern: "tempmail", 
    desc: "Generate a temporary email",
    category: "emails",
   filename: __filename
 }, 
   async (conn, mek, m, { reply }) => {
 try {
 const apiKey = "MepwBcqIM0jYN0okD"; 
const apiUrl = `https://api.nexoracle.com/misc/temp-mail-gen?apikey=${apiKey}`;
 const response = await fetchJson(apiUrl);

if (response.status !== 200) return reply("❌ Failed to generate temp mail!");

    global.tempmail = {
        email: response.result.email,
        email_id: response.result.email_id,
        expire_at: response.result.expire_at

    };

   return reply(`📩 *Temporary Email Created*\n\n📧 Email: ${global.tempmail.email}\n🆔 Email ID: ${global.tempmail.email_id}\n⏳ Expires At: ${global.tempmail.expire_at}`);
} catch (e) {
    console.error(e);
    reply("❌ An error occurred!");
}

});

cmd({ pattern: "checkmail", desc: "Check inbox of temp email", category: "emails", filename: __filename }, async (conn, mek, m, { reply, q }) => { try { if (!q) return reply("❌ Provide an email ID to check messages!");

const apiKey = "MepwBcqIM0jYN0okD";
    const apiUrl = `https://api.nexoracle.com/misc/temp-mail-inbox?apikey=${apiKey}&id=${q}`;
    const response = await fetchJson(apiUrl);

    if (response.status !== 200) return reply("❌ Failed to check emails!");

    const emails = response.result;
    if (!emails || emails.length === 0) return reply("📭 No new emails!");

    const msgHeader = `📬 *Inbox for Email ID:* ${q}\n\n`;
let msgBody = '';

emails.forEach((email, i) => {
    msgBody += `📩 *Email ${i + 1}*\n📝 Subject: ${email.subject}\n📅 Date: ${email.date}\n📨 Sender: ${email.from}\n📄 Message: ${email.text}\n\n`;
});

const msg = msgHeader + msgBody;

await conn.sendMessage(from, msg, { quoted: mek });

cmd({ pattern: "delmail", desc: "Delete stored temporary email", category: "emails", filename: __filename }, async (conn, mek, m, { reply }) => { try { if (!global.tempmail) return reply("❌ No temporary email found!");

delete global.tempmail;
  return  reply("🗑️ Temporary email deleted!");
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});