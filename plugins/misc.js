//---------------------------------------------
//           EMPIRE-MD  
//---------------------------------------------
//  @project_name : EMPIRE-MD  
//  @author       : efeurhobobullish
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------
const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./Lib/functions');
const fs = require('fs');
const axios = require('axios');
const { exec } = require('child_process'); 

//--------------------------------------------
//            INFO COMMANDS
//--------------------------------------------
cmd({
    pattern: "info",
    desc: "Displays important bot and owner information",
    category: "misc",
    filename: __filename,
  },
  async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isOwner, reply }) => {
    try {
      if (!isOwner) return reply("❏ This command can only be used by the bot owner.");

      const owner = "𝐄𝐦𝐩𝐢𝐫𝐞 𝐓𝐞𝐜𝐡 [ 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 ]";
      const repoLink = "https://github.com/efeurhobobullish/EMPIRE-MD";

      const uptime = runtime(process.uptime());

      const footer = "*𝐄𝐌𝐏𝐈𝐑𝐄-𝐌𝐃*";

      const finalMessage = `
╭─────❏ *BOT INFO* ❏
│ ❏ *Owner:* ${owner}
│ ❏ *Repository:* ${repoLink}
│ ❏ *Bot Uptime:* ${uptime}
╰────────────────────────`;

      const imageUrl = "https://files.catbox.moe/z7c67w.jpg";

      await conn.sendMessage(
        from,
        { image: { url: imageUrl }, caption: finalMessage },
        { quoted: mek }
      );

    } catch (e) {
      return reply(`❏ An error occurred while processing your request.\n\n❏ _Error:_ ${e.message}`);
    }
  });
//--------------------------------------------
//            ALIVE COMMANDS
//--------------------------------------------
cmd({
    pattern: "alive",
    desc: "Check if the bot is online.",
    category: "misc",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const uptime = runtime(process.uptime());

        const aliveMsg = `
╭───── *𝐸𝑀𝑃𝐼𝑅𝐸-𝑀𝐷* ───────
│ 𝙷𝙴𝙻𝙻𝙾 ${pushname}
│──────────────────
│ ❏ *UPTIME:* 
│ ➛ ${uptime}
╰──────────────────────── `;

        await conn.sendMessage(
            from,
            { 
                image: { url: 'https://files.catbox.moe/r4decc.jpg' },
                caption: aliveMsg
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`❏ An error occurred: ${e.message || e}`);
    }
});
//--------------------------------------------
//            PING COMMANDS
//--------------------------------------------
cmd({
    pattern: "ping",
    react: "♻️",
    alias: ["speed"],
    desc: "Check bot's ping",
    category: "misc",
    use: '.ping',
    filename: __filename
}, async (conn, mek, m, { from, quoted, pushname, reply }) => {
    try {
        const startTime = Date.now();
        const message = await conn.sendMessage(from, { text: '*_Pinging..._*' });
        const endTime = Date.now();
        const ping = endTime - startTime;

        await conn.sendMessage(from, {
            text: `𝑃𝑂𝑁𝐺!${ping}ᴍꜱ`
        }, { quoted: message });
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});
//--------------------------------------------
//            REPO COMMANDS
//--------------------------------------------
cmd({
    pattern: "repo",
    category: "misc",
    react: "📂",
    desc: "Fetch repository details.",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const githubRepoURL = 'https://github.com/efeurhobobullish/EMPIRE-MD';
        const regexMatch = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

        if (!regexMatch) {
            return reply("❏ Invalid GitHub URL format.");
        }

        const [, username, repoName] = regexMatch;
        const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);

        if (response.status !== 200) {
            return reply("❏ Unable to fetch repository information.");
        }

        const repoData = response.data;
        const description = repoData.description || "No description available";

        const formattedInfo = `
╭───── * REPO * ──────
│ ❏ *Repository Name:* ${repoData.name}
│ ❏ *Description:* ${description}
│ ❏ *Owner:* ${repoData.owner.login}
│ ❏ *Stars:* ${repoData.stargazers_count}
│ ❏ *Forks:* ${repoData.forks_count}
│ ❏ *URL:* ${repoData.html_url}
│ ❏ *Session:* https://empire-md-paircode.onrender.com
╰────────────────────────`;

        await conn.sendMessage(from, { text: formattedInfo }, { quoted: mek });

    } catch (error) {
        reply("❏ An error occurred while fetching repository information.");
    }
});
//--------------------------------------------
//            REPORT COMMANDS
//--------------------------------------------
cmd({
    pattern: "requestbug",
    alias: ["report"],
    category: "misc",
    react: "🤕",
    desc: "Allows users to report a bug with a description.",
    filename: __filename,
}, async (conn, mek, m, { from, body, sender, pushname }) => {
    try {
        const bugDescription = body.split(" ").slice(1).join(" ");

        if (!bugDescription) {
            return await conn.sendMessage(from, { text: "❏ Example: .requestbug This command is not working." }, { quoted: mek });
        }

        const devsNumber = global.devs;

        const requestMessage = `
╭───── *BUG REPORT* ───────
│ *From:* @${sender.split('@')[0]}
│ *Name:* ${pushname || "Unknown"}
│────────────────────────
│ ❏ *Report:*  
│ ➛ ${bugDescription}
╰────────────────────────
        `;

        await conn.sendMessage(`${devsNumber}@s.whatsapp.net`, { text: requestMessage });
        await conn.sendMessage(from, { text: "❏ Your bug report has been sent to the developers." }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: "❏ An error occurred while submitting your bug report. Please try again later." }, { quoted: mek });
    }
});
//--------------------------------------------
//            UPTIME COMMANDS
//--------------------------------------------
cmd({
    pattern: "uptime",
    desc: "Check bot's uptime.",
    category: "misc",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
        function formatUptime(seconds) {
            const days = Math.floor(seconds / (24 * 60 * 60));
            seconds %= 24 * 60 * 60;
            const hours = Math.floor(seconds / (60 * 60));
            seconds %= 60 * 60;
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);

            if (days > 0) return `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;
            if (hours > 0) return `${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;
            if (minutes > 0) return `${minutes} Minutes, ${seconds} Seconds`;
            return `${seconds} Seconds`;
        }

        const uptime = formatUptime(process.uptime());
        const uptimeMessage = `𝑈𝑝𝑡𝑖𝑚𝑒 𝑜𝑓 𝐸𝑀𝑃𝐼𝑅𝐸-𝑀𝐷: ${uptime}`;

        await conn.sendMessage(from, { text: uptimeMessage }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message || e}`);
    }
});
