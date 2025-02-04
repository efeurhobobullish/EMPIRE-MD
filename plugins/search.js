const axios = require('axios');
const fg = require('api-dylux');
const config = require('../config');
const { cmd, commands } = require('../command');
const prefix = config.PREFIX; 
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../Lib/functions');

// ss commands
cmd({
    pattern: "ss",
    desc: "Screenshot a website",
    category: "search", // Category updated to 'search'
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        if (!q) return reply("Please send the website URL to screenshot.");

        const url = q.trim();
        if (!/^https?:\/\//.test(url)) {
            return reply("Please enter a valid URL starting with http:// or https://");
        }

        // Screenshot API endpoint with API key
        const screenshotApi = `https://api.nexoracle.com/misc/ss-web?apikey=MepwBcqIM0jYN0okD&url=${encodeURIComponent(url)}`;

        // Fetch the screenshot (expecting JSON response)
        const response = await axios.get(screenshotApi);

        // Check if the response contains a URL for the screenshot
        if (response.data?.url) {
            // Send the screenshot image from the URL (as the API likely returns the image URL)
            await conn.sendMessage(from, {
                image: { url: response.data.url },
            }, { quoted: mek });
        } else {
            reply("No screenshot found for the provided URL.");
        }

    } catch (e) {
        console.error(e.response?.data || e.message); // Log detailed error
        reply(`An error occurred: ${e.response?.data?.error || e.message}`);
    }
});


cmd({
    pattern: "translate",
    desc: "Translate the given text to a specified language.",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        // Check if the user provided text to translate and a target language
        if (args.length < 2) {
            return reply("Please provide both the text to translate and the language code (e.g., `!translate Hola to en`).");
        }

        // Extract the text to translate and the language code
        const text = args.slice(0, args.length - 1).join(" ");
        const targetLang = args[args.length - 1];

        // URL encode the text
        const encodedText = encodeURIComponent(text);

        // API endpoint with the text and target language
        const apiUrl = `https://api.nexoracle.com/misc/translate?apikey=MepwBcqIM0jYN0okD&text=${encodedText}&to=${targetLang}`;

        // Send the request to the translation API
        const response = await axios.get(apiUrl);

        // Extract the translated text from the response
        const translatedText = response.data.result;

        // If translation is successful, send the translated text to the user
        if (translatedText) {
            return reply(`Here is the translation:\n\`\`\`\n${translatedText}\n\`\`\``);
        } else {
            return reply("Sorry, I couldn't translate the text. Please try again later.");
        }
    } catch (error) {
        console.error("Error during translation:", error);
        return reply("❌ An error occurred while translating. Please try again later.");
    }
});

cmd({
    pattern: "weather",
    desc: "🌤 Get weather information for a location",
    react: "🌤",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a city name. Usage: .weather [city name]");
        const apiKey = '2d61a72574c11c4f36173b627f8cb177'; 
        const city = q;
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        const data = response.data;
        const weather = `
🌍 *Weather Information for ${data.name}, ${data.sys.country}* 🌍
🌡️ *Temperature*: ${data.main.temp}°C
🌡️ *Feels Like*: ${data.main.feels_like}°C
🌡️ *Min Temp*: ${data.main.temp_min}°C
🌡️ *Max Temp*: ${data.main.temp_max}°C
💧 *Humidity*: ${data.main.humidity}%
☁️ *Weather*: ${data.weather[0].main}
🌫️ *Description*: ${data.weather[0].description}
💨 *Wind Speed*: ${data.wind.speed} m/s
🔽 *Pressure*: ${data.main.pressure} hPa

> *${global.caption}*
`;
        return reply(weather);
    } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 404) {
            return reply("🚫 City not found. Please check the spelling and try again.");
        }
        return reply("⚠️ An error occurred while fetching the weather information. Please try again later.");
    }
});
