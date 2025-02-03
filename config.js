//---------------------------------------------------------------------------
//           EMPIRE-MD  
//---------------------------------------------------------------------------
//  @project_name : EMPIRE-MD  
//  @author       : efeurhobobullish
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------------------------------------
const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

//═════[Don't Change Variables]════════\\

global.alive_img = "📞 𝐴𝑢𝑡𝑜 𝐶𝑎𝑙𝑙 𝑅𝑒𝑗𝑒𝑐𝑡 𝑀𝑜𝑑𝑒 𝐴𝑐𝑡𝑖𝑣𝑒. 📵 𝑁𝑜 𝐶𝑎𝑙𝑙𝑠 𝐴𝑙𝑙𝑜𝑤𝑒𝑑!";
global.caption = "©𝟐𝟎𝟐𝟓 𝐄𝐦𝐩𝐢𝐫𝐞 𝐓𝐞𝐜𝐡 [ 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 ]";
global.channelUrl = "https://whatsapp.com/channel/0029VajVvpQIyPtUbYt3Oz0k";
global.botname = "𝐸𝑀𝑃𝐼𝑅𝐸-𝑀𝐷";
global.devs = "2348078582627" // Developer Contact
global.session = "https://empire-md-paircode-infy.onrender.com"; // DO NOT Change this....
global.devsname = "𝐄𝐦𝐩𝐢𝐫𝐞 𝐓𝐞𝐜𝐡 [ 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 ]";


module.exports = {
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
    ANTICALL: process.env.ANTICALL || "false",
    ANTICALL_MSG: process.env.ANTICALL_MSG || "*_📞 Auto Call Reject Mode Active. 📵 No Calls Allowed!_*",
    ANTILINK: process.env.ANTILINK || "false",
    AUTO_LIKE_EMOJI: process.env.AUTO_LIKE_EMOJI || "💜",
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || "false",
    AUTO_RECORDING: process.env.AUTO_RECORDING || "false",
    AUTO_TYPING: process.env.AUTO_TYPING || "false",
    AUTO_VIEW_STATUS: process.env.AUTO_VIEW_STATUS || "false",
    MODE: process.env.MODE || "private",
    OWNER_NAME: process.env.OWNER_NAME || "𝐄𝐦𝐩𝐢𝐫𝐞 𝐓𝐞𝐜𝐡 [ 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 ]",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "2348078582627",
    PREFIX: process.env.PREFIX || ".",
    SESSION_ID: process.env.SESSION_ID || "put session id here"
};
