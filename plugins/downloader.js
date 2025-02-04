//---------------------------------------------------------------------------
//           EMPIRE-MD  
//---------------------------------------------------------------------------
//  @project_name : EMPIRE-MD  
//  @author       : efeurhobo  
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------------------------------------

const { cmd, commands } = require('../command');
const fg = require('api-dylux');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const yts = require('yt-search');
const config = require('../config');
const url = require('url');
const prefix = config.PREFIX;

//---------------------------------------------------------------------------
//            AUDIO COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "audio",
    alias: ["play"],
    desc: "Download songs",
    category: "downloader",
    react: "🎶",
    filename: __filename,
  },
  async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
   try {
      if (!q) return reply("Send me url or title name");

      // Search for the video
      const search = await yts(q);
      const data = search.videos[0];
      const url = data.url;
      // Build a download URL; adjust the endpoint as needed.
      const downloadUrl = `https://ironman.koyeb.app/ironman/dl/yta?url=${url}`;

      // Build the info message
      const infoMessage = {
        image: { url: data.thumbnail },
        caption: `
╭───── *𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*───────
│ 
│ *Title:* ${data.title}
│ *Quality:* mp3 (128kbps)
│ *Duration:* ${data.timestamp}
│ *Viewers:* ${data.views}
│ *Uploaded:* ${data.ago}
│ *Artist:* ${data.author.name}
│────────────────────────
│⦿ *Direct Yt Link:* ${url}
│────────────────────────
│ ${global.caption}
╰────────────────────────`,
        contextInfo: {
          mentionedJid: [mek.sender],
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363337275149306@newsletter",
            newsletterName: global.botname,
            serverMessageId: 143,
          },
        },
      };

      // Send the info message
      await conn.sendMessage(from, infoMessage, { quoted: mek });

      // Send the audio file with additional context (such as externalAdReply)
      await conn.sendMessage(
        from,
        {
          audio: { url: downloadUrl },
          fileName: `${data.title}.mp3`,
          mimetype: "audio/mpeg",
          contextInfo: {
            externalAdReply: {
              showAdAttribution: false,
              title: data.title,
              body: global.caption,
              thumbnailUrl: data.thumbnail,
              sourceUrl: global.channelUrl,
              mediaType: 1,
              renderLargerThumbnail: false,
            },
          },
        },
        { quoted: mek }
      );
      // React to confirm completion
      await m.react("✅");
    } catch (e) {
      console.error("Error in play command:", e);
      reply(`❌ Error: ${e.message}`);
    }
  });
//---------------------------------------------------------------------------
//            VIDEO COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "video",
    alias: ["mp4"],
    desc: "Download songs",
    category: "downloader",
    react: "🎶",
    filename: __filename,
  },
  async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
   try {
      if (!q) return reply("Send me url or title name");

      // Search for the video
      const search = await yts(q);
      const data = search.videos[0];
      const url = data.url;
      // Build a download URL; adjust the endpoint as needed.
      const downloadUrl = `https://ironman.koyeb.app/ironman/dl/ytv?url=${url}`;

      // Build the info message
      const infoMessage = {
        image: { url: data.thumbnail },
        caption: `
╭─────*𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*───────
│ 
│ *Title:* ${data.title}
│ *Quality:* mp3 (128kbps)
│ *Duration:* ${data.timestamp}
│ *Viewers:* ${data.views}
│ *Uploaded:* ${data.ago}
│ *Artist:* ${data.author.name}
│────────────────────────
│⦿ *Direct Yt Link:* ${url}
│────────────────────────
│ ${global.caption}
╰────────────────────────`,
        contextInfo: {
          mentionedJid: [mek.sender],
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363337275149306@newsletter",
            newsletterName: global.botname,
            serverMessageId: 143,
          },
        },
      };

      // Send the info message
      await conn.sendMessage(from, infoMessage, { quoted: mek });

      // Send the audio file with additional context (such as externalAdReply)
      await conn.sendMessage(
        from,
        {
          video: { url: downloadUrl },
          fileName: `${data.title}.mp4`,
          mimetype: "video/mp4",
          contextInfo: {
            externalAdReply: {
              showAdAttribution: false,
              title: data.title,
              body: global.botname,
              thumbnailUrl: data.thumbnail,
              sourceUrl: global.channelUrl,
              mediaType: 1,
              renderLargerThumbnail: false,
            },
          },
        },
        { quoted: mek }
      );
      // React to confirm completion
      await m.react("✅");
    } catch (e) {
      console.error("Error in play command:", e);
      reply(`❌ Error: ${e.message}`);
    }
  });
//---------------------------------------------------------------------------
//            TIKTOK COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "tiktok",
    desc: "Download a TikTok video without watermark.",
    react: "🎥",
    category: "downloader",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Please provide the TikTok video URL.");

        const tiktokUrl = encodeURIComponent(q);
        const apiUrl = `https://api.nexoracle.com/downloader/tiktok-nowm?apikey=MepwBcqIM0jYN0okD&url=${tiktokUrl}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.status !== 200 || !data.result) {
            return reply("Unable to fetch TikTok video. Please check the URL.");
        }

        const videoDetails = data.result;
        const videoUrl = videoDetails.url;
        const title = videoDetails.title;
        const authorName = videoDetails.author.nickname;
        const thumbnailUrl = videoDetails.thumbnail;

        const infoMessage = {
            image: { url: thumbnailUrl },
            caption: `
╭───── *𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑* ──────────
│ 
│ *Title:* ${title}
│ *Author:* ${authorName}
│ *Duration:* ${videoDetails.duration}s
│──────────────────────────────
│⦿ *Direct TikTok Link:* ${q}
│──────────────────────────────
│ ${global.caption}  // This is where global.caption goes
╰──────────────────────────────`,
            contextInfo: {
                mentionedJid: [mek.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363337275149306@newsletter',
                    newsletterName: global.botname,
                    serverMessageId: 143
                }
            }
        };

        await conn.sendMessage(from, infoMessage, { quoted: mek });

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            fileName: `${title}.mp4`,
            mimetype: 'video/mp4',
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: title,
                    body: global.caption,
                    thumbnailUrl: thumbnailUrl,
                    sourceUrl: global.channelUrl,
                    mediaType: 2, // video
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

        await m.react("✅");
    } catch (e) {
        console.error("Error in tiktok download command:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
//---------------------------------------------------------------------------
//         GOGGLE DRIVE COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "gdrive",
    desc: "Download Google Drive Files",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, pushname, command, args, q, reply }) => {
    try {
        if (!q) {
            return reply("Please send me the Google Drive link.");
        }

        const url = q.trim();
        const apiUrl = `https://api.nexoracle.com/downloader/gdrive?apikey=ae1fa2a45a76baba7d&url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.result || !response.data.result.downloadUrl) {
            return reply("Sorry, I couldn't fetch the file. Make sure the link is valid.");
        }

        const fileData = response.data.result;

        const infoMessage = {
            caption: `
╭───── *𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑* ──────────
│ 
│ *File Name:* ${fileData.fileName}
│ *MIME Type:* ${fileData.mimetype}
│ *Size:* ${fileData.size}
│──────────────────────────────
│⦿ *Google Drive Link:* ${url}
│──────────────────────────────
│ ${global.caption}  // This is where global.caption goes
╰──────────────────────────────`,
            contextInfo: {
                mentionedJid: [mek.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363337275149306@newsletter',
                    newsletterName: global.botname,
                    serverMessageId: 143
                }
            }
        };

        await conn.sendMessage(from, infoMessage, { quoted: mek });

        await conn.sendMessage(from, {
            document: { url: fileData.downloadUrl },
            mimetype: fileData.mimetype,
            fileName: fileData.fileName,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: fileData.fileName,
                    body: global.caption,
                    thumbnailUrl: fileData.thumbnailUrl || global.defaultThumbnail,
                    sourceUrl: global.channelUrl,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

        await m.react("✅");
    } catch (e) {
        console.error("Error in gdrive download command:", e);
        reply(`❌ Error: ${e.message || e.response?.data?.error || e}`);
    }
});
//---------------------------------------------------------------------------
//            PINTEREST COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "pinterest",
    desc: "Download media from Pinterest.",
    category: "downloader",
    filename: __filename,
}, async (conn, mek, m, { args, pushname,reply }) => {
    try {
        const pinterestUrl = args[0];
        if (!pinterestUrl) {
            return reply("Please provide the Pinterest media URL.");
        }

        const response = await axios.get(`https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(pinterestUrl)}`);
        const downloadUrl = response.data.result.url;

        if (!downloadUrl) {
            return reply("❌ Unable to fetch the Pinterest media. Please check the URL and try again.");
        }

        await conn.sendMessage(m.from, {
            image: { url: downloadUrl },
            caption: global.caption
        });
        await m.react("✅");
    } catch (err) {
        console.error("Error fetching Pinterest media URL:", err);
        return reply("❌ Unable to fetch Pinterest media. Pl ease try again later.");
    }
});
//---------------------------------------------------------------------------
//            GITCLONE COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "gitclone",
    desc: "Clone GitHub Repositories",
    category: "downloader",
    react: "🌐",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Please provide the GitHub repository URL.");

        const repoUrl = q;
        const apiUrl = `https://api.giftedtech.web.id/api/download/gitclone?apikey=gifted&url=${repoUrl}`;

        // Send message with repository information
        let desc = `
╭───── *𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑* ──────────
│ > Cloning Repository
│──────────────────────────────
│⦿ *Direct Repo Link:* ${repoUrl}
│──────────────────────────────
│ ${global.caption} 
╰──────────────────────────────`;
        await conn.sendMessage(from, { text: desc }, { quoted: mek });

        await conn.sendMessage(from, {
            document: { url: apiUrl },
            mimetype: "application/zip",
            fileName: `${repoUrl.split("/").pop()}.zip`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message || e.response?.data?.error || e}`);
    }
});
//---------------------------------------------------------------------------
//            FACEBOOK COMMANDS
//---------------------------------------------------------------------------
cmd({
  pattern: "facebook",
  alias: "fbdl",
  react: "🚀",
  category: "downloader",
  desc: "Fetches Facebook video download link.",
  use: "<url>",
  filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, pushname, q, reply }) => {
  try {
    if (!q) {
      return reply(`Example:\n*${config.PREFIX}facebook <url>*`);
    }

    const apiUrl = `https://api.nexoracle.com/downloader/facebook?apikey=MepwBcqIM0jYN0okD&url=${encodeURIComponent(q)}`;
    const result = await axios.get(apiUrl);

    if (!result.data) {
      return reply(`*Something went wrong. Please try again later.*`);
    }

    const data = result.data.result;

    const infoMessage = {
      video: { url: data.sd },
      caption: `
╭───── *FACEBOOK VIDEO DOWNLOADER* ─────
│ *Title:* ${data.title}
│ *Description:* ${data.desc}
│──────────────────────────────
│⦿ *Direct Video Link:* ${data.sd}
╰──────────────────────────────`,
      fileName: "facebook_video.mp4",
      mimetype: "video/mp4"
    };

    await conn.sendMessage(from, infoMessage, { quoted });

  } catch (e) {
    return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
  }
});
//---------------------------------------------------------------------------
//            APK COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "apk",
    desc: "Fetches and downloads APK file.",
    category: "downloader",
    react: "📱",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, pushname, q, reply }) => {
    try {
        if (!q) {
            return reply(`*Please provide a query, ${pushname}!*`);
        }

        const apiUrl = `https://api.nexoracle.com/downloader/apk?apikey=MepwBcqIM0jYN0okD&q=${encodeURIComponent(q)}`;
        const result = await axios.get(apiUrl);

        if (!result.data) {
            return reply(`*Something went wrong. Please try again later.*`);
        }

        const data = result.data.result;
        const apkUrl = data.dllink;
        const fileName = `${data.name}.apk`;
        const filePath = path.join(__dirname, fileName);

        const response = await axios({
            url: apkUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        writer.on('finish', async () => {
            await conn.sendMessage(
                from,
                {
                    document: { url: filePath },
                    caption: `
╭───── *𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑* ──────────
│ 
│ *App Name:* ${data.name}
│ *Size:* ${data.size}
│ *Query:* ${q}
│──────────────────────────────
│ ${global.caption} 
╰──────────────────────────────`,
                    fileName: fileName,
                    mimetype: "application/vnd.android.package-archive"
                },
                { quoted: mek }
            );

            fs.unlinkSync(filePath);
        });

        writer.on('error', (err) => {
            throw err;
        });

    } catch (e) {
        return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});
