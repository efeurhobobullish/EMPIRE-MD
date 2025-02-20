const chalk = require('chalk');
const config = require("../config");
const ownerjidd = `${config.OWNER_NUMBER}@s.whatsapp.net`;

class AntideleteModule {
    constructor() {
        this.ownerJid = null;
        this.enabled = false;
        this.sock = null;
    }

    isGroup(jid) {
        return jid.endsWith('@g.us');
    }

    isStatus(jid) {
        return jid === 'status@broadcast';
    }

    shouldTrackMessage(message) {
        if (this.isStatus(message.key.remoteJid)) return false;
        if (!message.message) return false;

        const excludedTypes = [
            'protocolMessage',
            'senderKeyDistributionMessage',
            'messageContextInfo'
        ];

        const messageType = Object.keys(message.message)[0];
        return !excludedTypes.includes(messageType);
    }

    setOwnerJid() {
        if (!ownerjidd) {
            console.error('❌ Owner number not set in config settings');
            return;
        }
        this.ownerJid = ownerjidd;
    }

    createFakeReply(id) {
        return {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast",
                id: id
            },
            message: {
                conversation: "*ANTIDELETE DETECTED*"
            }
        };
    }

    async getGroupName(jid) {
        try {
            const groupMetadata = await this.sock.groupMetadata(jid);
            return groupMetadata.subject;
        } catch (error) {
            console.error('❌ Error fetching group name:', error);
            return jid.split('@')[0];
        }
    }

    async handleMessageUpdate(update, store) {
        if (!config.ANTIDELETE || !this.enabled || !this.ownerJid) return;

        const chat = update.key.remoteJid;
        const messageId = update.key.id;

        if (this.isStatus(chat)) return;

        const isDeleted = 
            update.update.message === null || 
            update.update.messageStubType === 2 ||
            (update.update.message?.protocolMessage?.type === 0);

        if (isDeleted) {
            try {
                const deletedMessage = await store.loadMessage(chat, messageId);
                
                if (!deletedMessage) {
                    console.log(chalk.yellow('⚠️ Deleted message not found in store'));
                    return;
                }

                if (!this.shouldTrackMessage(deletedMessage)) return;

                await this.forwardDeletedMessage(chat, deletedMessage);
            } catch (error) {
                console.error('❌ Error handling deleted message:', error);
            }
        }
    }

    async forwardDeletedMessage(chat, deletedMessage) {
        const deletedBy = deletedMessage.key.fromMe ? this.sock.user.id : deletedMessage.key.participant || chat;
        const sender = deletedMessage.key.participant || deletedMessage.key.remoteJid;
    
        // Determine where to send the notification
        const sendToJid = config.ANTIDELETE_PM ? chat : this.ownerJid;

        try {
            const forwardedMessage = await this.sock.sendMessage(
                sendToJid,
                { forward: deletedMessage },
                { quoted: this.createFakeReply(deletedMessage.key.id) }
            );
            
            if (forwardedMessage) {
                const chatName = this.isGroup(chat) ? 
                    await this.getGroupName(chat) : 
                    "Private Chat";
                
                const mentions = [sender, deletedBy].filter((jid, index, self) => 
                    self.indexOf(jid) === index
                );

                // Customize message based on destination
                const notificationText = config.ANTIDELETE_PM
                    ? this.createPublicNotification(sender, deletedBy)
                    : this.createNotificationText(chatName, sender, deletedBy, chat);

                await this.sock.sendMessage(
                    sendToJid,
                    {
                        text: notificationText,
                        mentions: mentions
                    },
                    { quoted: forwardedMessage }
                );
            }
        } catch (error) {
            console.error('❌ Error forwarding deleted message:', error);
        }
    }

    // Add new notification format for public messages
    createPublicNotification(sender, deletedBy) {
        return `*⚠️ DELETED MESSAGE DETECTED*\n\n` +
               `📩 *Author:* @${sender.split('@')[0]}\n` +
               `🗑️ *Deleted by:* @${deletedBy.split('@')[0]}\n` +
               `⏳ *Time:* ${new Date().toLocaleTimeString()}`;
    }

    // Modify existing notification for private (owner) messages
    createNotificationText(chatName, sender, deletedBy, chat) {
        return `*🔍 DELETED MESSAGE INFORMATION*\n\n` +
               `📅 *TIME:* ${new Date().toLocaleString()}\n` +
               `👤 *MESSAGE FROM:* @${sender.split('@')[0]}\n` +
               `💬 *CHAT:* ${chatName}\n` +
               `❌ *DELETED BY:* @${deletedBy.split('@')[0]}\n` +
               `👥 *IS GROUP:* ${this.isGroup(chat) ? 'Yes' : 'No'}`;
    }

    logError(message, error) {
        console.error(chalk.red(`❌ ${message}: ${error?.message || error}`));
    }

    async setup(sock) {
        if (!config.ANTIDELETE) {
            return this;
        }

        try {
            this.setOwnerJid();
            this.enabled = true;
            this.sock = sock;
            return this;
        } catch (error) {
            console.error('❌ Error setting up Antidelete module:', error);
            throw error;
        }
    }

    async execute(sock, update, options = {}) {
        await this.handleMessageUpdate(update, options.store);
    }
}

async function setupAntidelete(sock) {
    const antideleteModule = new AntideleteModule();
    return antideleteModule.setup(sock);
}

module.exports = {
    setupAntidelete
};