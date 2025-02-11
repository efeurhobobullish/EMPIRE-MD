//---------------------------------------------
//           EMPIRE-MD  
//---------------------------------------------
//  @project_name : EMPIRE-MD  
//  @author       : efeurhobobullish
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------
const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require("../command");
const fetch = require("node-fetch");
const JavaScriptObfuscator = require("javascript-obfuscator");
const prefix = config.PREFIX;

//--------------------------------------------
// OBFUSCATE COMMANDS
//--------------------------------------------

cmd({
  pattern: "obfuscate",
  desc: "Obfuscate JavaScript code",
  category: "coding",
  filename: __filename
}, async (_conn, mek, m, { args, q, reply }) => {
  try {
    const code = q || args.join(" ");
    if (!code) {
      return reply("❌ Please provide JavaScript code to obfuscate.");
    }
    
    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true
    }).getObfuscatedCode();

    return reply("✅ Here is your obfuscated code:\n```javascript\n" + obfuscated + "\n```");
  } catch (error) {
    console.error("Error obfuscating the code:", error);
    return reply("❌ An error occurred while obfuscating the code. Please try again.");
  }
});

//--------------------------------------------
// DEOBFUSCATE COMMANDS
//--------------------------------------------

cmd({
  pattern: "deobfuscate",
  desc: "Fully deobfuscate JavaScript code",
  category: "coding",
  filename: __filename
}, async (_conn, _mek, _m, { args, q, reply }) => {
  try {
    const code = q || args.join(" ");
    if (!code) {
      return reply("❌ Please provide obfuscated JavaScript code to deobfuscate.");
    }

    // Send a POST request to deobfuscator.io API
    const response = await fetch("https://deobfuscator.io/api/deobfuscate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    const result = await response.json();
    if (!result.success) {
      return reply("❌ Failed to deobfuscate the code.");
    }

    return reply("✅ Here is your deobfuscated code:\n```javascript\n" + result.deobfuscatedCode + "\n```");
  } catch (error) {
    console.error("Error deobfuscating the code:", error);
    return reply("❌ An error occurred while deobfuscating the code. Please try again.");
  }
});