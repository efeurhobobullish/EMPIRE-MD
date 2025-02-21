//---------------------------------------------------------------------------
//           EMPIRE-MD  
//---------------------------------------------------------------------------
//  @project_name : EMPIRE-MD  
//  @author       : efeurhobobullish
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------------------------------------

const fs = require('fs');
const axios = require('axios');
const envPath = './config.env';
const dotenv = require('dotenv');

// Fetch a buffer from a URL 
const getBuffer = async (url, options) => { try { options = options || {}; const res = await axios({ method: 'get', url, headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1 }, ...options, responseType: 'arraybuffer' }); return res.data; } catch (e) { console.error(e); return null; } };

// Get admin participants from a group
const getGroupAdmins = (participants) => { return participants.filter(p => p.admin !== null).map(p => p.id); };

// Generate a random string with an extension 
const getRandom = (ext) => ${Math.floor(Math.random() * 10000)}${ext};

// Format large numbers with suffixes (e.g., K, M, B) 
const h2k = (eco) => { const units = ['', 'K', 'M', 'B', 'T', 'P', 'E']; const magnitude = Math.floor(Math.log10(Math.abs(eco)) / 3); if (magnitude === 0) return eco.toString(); const scale = Math.pow(10, magnitude * 3); return (eco / scale).toFixed(1).replace(/.0$/, '') + units[magnitude]; };

// Check if a string is a URL 
const isUrl = (url) => /https?://(www.)?[-a-zA-Z0-9@:%.+#?&/=]*)/.test(url);

// Convert a JavaScript object or array to a JSON string 
const Json = (string) => JSON.stringify(string, null, 2);

// Function to calculate and format uptime 
const runtime = (seconds) => { seconds = Math.floor(seconds); const d = Math.floor(seconds / (24 * 60 * 60)); seconds %= 24 * 60 * 60; const h = Math.floor(seconds / (60 * 60)); seconds %= 60 * 60; const m = Math.floor(seconds / 60); const s = seconds % 60;

return d > 0 ? `${d}d ${h}h ${m}m ${s}s` :
       h > 0 ? `${h}h ${m}m ${s}s` :
       m > 0 ? `${m}m ${s}s` : `${s}s`;

};

// Delay execution for a specified time 
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch JSON from a URL 
const fetchJson = async (url, options) => { try { options = options || {}; const res = await axios({ method: 'GET', url, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36' }, ...options }); return res.data; } catch (err) { console.error(err); return null; } };

// Save config settings 
const saveConfig = (key, value) => { let configData = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8').split('\n') : []; let found = false;

configData = configData.map(line => {
    if (line.startsWith(`${key}=`)) {
        found = true;
        return `${key}=${value}`;
    }
    return line;
});

if (!found) configData.push(`${key}=${value}`);
fs.writeFileSync(envPath, configData.join('\n'), 'utf8');
dotenv.config({ path: envPath }); // Reload updated environment variables

};

module.exports = { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, saveConfig };

