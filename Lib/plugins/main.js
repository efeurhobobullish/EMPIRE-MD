//---------------------------------------------
//           EMPIRE-MD  
//---------------------------------------------
//  @project_name : EMPIRE-MD  
//  @author       : efeurhobo  
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------
const config = require('../config');
const { cmd, commands } = require('../command');
const { monospace } = require('../Lib/monospace');
const os = require('os'); // Import the os module
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./Lib/functions');

// Use global variables for dynamic content
const botname = global.botname || "𝐸𝑀𝑃𝐼𝑅𝐸-𝑀𝐷";
const prefix = config.PREFIX || ".";
const version = "1.0.0";

//--------------------------------------------
//            MENU COMMANDS
//--------------------------------------------
cmd({
    pattern: "menu",
    desc: "Get command list",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, quoted, sender, pushname, reply }) => {
    try {
        // Time and Date
        const now = new Date();
        const timeZone = 'Africa/Lagos';
        const options = { timeZone, hour12: true };
        const time = now.toLocaleTimeString('en-US', options);
        const date = now.toLocaleDateString('en-US', options);
        const dayOfWeek = now.toLocaleDateString('en-US', { timeZone, weekday: 'long' });

        // System Info
        const uptime = runtime(process.uptime()); // Use runtime function to get uptime
        const totalMemory = os.totalmem() / (1024 * 1024); // Total memory in MB
        const freeMemory = os.freemem() / (1024 * 1024); // Free memory in MB
        const usedMemory = totalMemory - freeMemory;
        const totalCommands = commands.length;

        // Categorize commands dynamically
        const categorized = commands.reduce((menu, cmd) => {
            if (cmd.pattern && !cmd.dontAddCommandList) {
                if (!menu[cmd.category]) menu[cmd.category] = [];
                menu[cmd.category].push(cmd.pattern);
            }
            return menu;
        }, {});

        // Header
        const header = `\`\`\`
╭─── ${monospace(botname)} ───
│ Owner: ${pushname}
│ Prefix: ${prefix}
│ Commands: ${monospace(totalCommands.toString())}
│ Mode: ${global.MODE || "private"}
│ Uptime: ${uptime}  // Using runtime function for uptime
│ Platform: ${os.platform()}
│ Memory: ${usedMemory.toFixed(2)}MB / ${totalMemory.toFixed(2)}MB
│ Day: ${dayOfWeek}
│ Date: ${date}
│ Time: ${time}
│ Version: ${version}
╰─────────────────\`\`\`\n`;

        // Format categories
        const formatCategory = (category, cmds) => {
            const title = `╭──── *${monospace(category.toUpperCase())}* ────\n`;
            const body = cmds.map((cmd, index) => `│ ${index + 1}. ${monospace(prefix + cmd)}`).join('\n');
            const footer = `╰────────────\n`;
            return `${title}${body}\n${footer}`;
        };

        // Generate menu
        let menu = header;
        for (const [category, cmds] of Object.entries(categorized)) {
            menu += formatCategory(category, cmds) + '\n';
        }

        // Send menu
        await conn.sendMessage(from, { text: menu.trim() }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
