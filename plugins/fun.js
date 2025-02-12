const { cmd, commands } = require('../command');
const { sleep } = require('../Lib/functions');
const msg = require('../Lib/msg');
const axios = require('axios'); // Import axios

// Helper function to fetch data from the API using axios
async function get(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`HTTP error! status: ${error.response ? error.response.status : error.message}`);
    }
}

//--------------------------------------------
// HACK COMMANDS
//--------------------------------------------
cmd({
    pattern: "hack",
    desc: "Hacking prank",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const messages = [
            "HAKI Injecting Malware",
            " █ 10%",
            " █ █ 20%",
            " █ █ █ 30%",
            " █ █ █ █ 40%",
            " █ █ █ █ █ 50%",
            " █ █ █ █ █ █ 60%",
            " █ █ █ █ █ █ █ 70%",
            " █ █ █ █ █ █ █ █ 80%",
            " █ █ █ █ █ █ █ █ █ 90%",
            "System hijacking on process.. \\n Connecting to Server error to find 404 ",
            "Device successfully connected... \\n Receiving data...",
            "Data hijacked from device 100% completed \\n Killing all evidence, killing all malware...",
            "HACKING COMPLETED",
            "SENDING LOG DOCUMENTS...",
            "SUCCESSFULLY SENT DATA AND Connection disconnected",
            "BACKLOGS CLEARED"
        ];

        for (const message of messages) {
            await conn.sendMessage(from, { text: message }, { quoted: mek });
            await sleep(1000); // Delay between messages
        }

    } catch (e) {
        console.log(e);
        await reply(`❌ An error occurred: ${e}`);
    }
});

//--------------------------------------------
// RIZZ COMMANDS
//--------------------------------------------
cmd({
    pattern: "rizz",
    desc: "Get a random pickup line",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let data = await get(`https://empire-tech-api.koyeb.app/api/fun/rizz?apikey=CBfmvL`);
        return reply(`${data.result}`);
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
//--------------------------------------------
// MOTIVATION COMMANDS
//--------------------------------------------
cmd({
    pattern: "motivation",
    desc: "Get a motivational quote",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let data = await get(`https://empire-tech-api.koyeb.app/api/fun/motivation?apikey=CBfmvL`);
        return reply(`${data.result}`);
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//--------------------------------------------
// QUOTES COMMANDS
//--------------------------------------------

cmd({
    pattern: "quotes",
    desc: "Get a motivational quote",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let response = await axios.get(`https://empire-tech-api.koyeb.app/api/fun/quotes?apikey=CBfmvL`);
        
        console.log("API Response:", response.data); // Debugging log

        if (!response.data || typeof response.data !== "object" || !response.data.result) {
            return reply("❌ Failed to fetch quote! Invalid response from API.");
        }

        let { author, text } = response.data.result;
        return reply(`✨ *Quote of the Day* ✨\n\n"${text}"\n\n- *${author}*`);
    } catch (e) {
        console.log("Request Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
//--------------------------------------------
// JOKES COMMANDS
//--------------------------------------------
cmd({
    pattern: "jokes",
    desc: "Get a random joke",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let data = await get(`https://empire-tech-api.koyeb.app/api/fun/jokes?apikey=CBfmvL`);
        return reply(`${data.result}`);  // Ensure the result is a string.
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//--------------------------------------------
//  ADVICE COMMANDS
//--------------------------------------------
cmd({
    pattern: "advice",
    desc: "Get a random piece of advice",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let data = await get(`https://api.giftedtech.web.id/api/fun/advice?apikey=_0x5aff35,_0x1876stqr`);
        return reply(`${data.result}`);
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
//--------------------------------------------
// TRUTH COMMANDS
//--------------------------------------------
cmd({
    pattern: "truth",
    desc: "Get a random truth",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let data = await get(`https://api.giftedtech.web.id/api/fun/truth?apikey=_0x5aff35,_0x1876stqr`);
        return reply(`${data.result}`);
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
//--------------------------------------------
//  INSULT COMMANDS
//--------------------------------------------
cmd({
  pattern: "insult",
  desc: "Get a random insult",
  category: "fun",
  react: "🤥",
}, async (conn, m) => {
  try {
    let response = await axios.get('https://empire-tech-api.koyeb.app/api/fun/insult?apikey=CBfmvL');
    let data = response.data;

    if (!data || !data.insult) {
      return await conn.sendMessage(m.key.remoteJid, { text: 'Unable to retrieve an insult. Please try again later.' });
    }

    let insult = data.insult;
    await conn.sendMessage(m.key.remoteJid, { text: `*Insult:* ${insult}` });
  } catch (error) {
    await conn.sendMessage(m.key.remoteJid, { text: `Error: ${error.message || error}` });
  }
});
