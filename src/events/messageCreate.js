const { Message, EmbedBuilder } = require("discord.js");
const client = require("../index.js");
const Utils = require("../utils.js");
const stickySchema = require('../Schemas/stickySchema');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot || message.system) return;

        const member = await message.guild.members.fetch(message.author.id);

        if (member.roles.cache.some(role => role.id === Utils.ignoredRoleId)) return;

        if (
            message.channel.id === '1179834903802679427' &&
            !message.channel.isThread()
        ) {
            await message.react(Utils.customEmoji1);
            await message.react(Utils.customEmoji2);
        }

        try {
            const data = await stickySchema.findOne({ ChannelID: message.channel.id }).exec();
        
            if (!data) {
                return;
            }
        
            let channel = data.ChannelID;
            let cachedChannel = client.channels.cache.get(channel);
        
            // Build the sticky message embed
            const embed = new EmbedBuilder()
                .setColor("#000000")
                .setTitle("Sticky Message")
                .setDescription(`${data.Message}`)
                .setFooter({ text: "Noah's Nation" });
        
            if (message.channel.id == channel) {
                data.CurrentCount += 1;
                await data.save();
        
                if (data.CurrentCount >= data.MaxCount) {
                    try {
                        const m = await client.channels.cache.get(channel).messages.fetch(data.LastMessageID);
                        await m.delete();
        
                        let newMessage = await cachedChannel.send({ embeds: [embed] });
        
                        data.LastMessageID = newMessage.id;
                        data.CurrentCount = 0;
                        await data.save();
                    } catch (error) {
                        console.error("Error occurred while deleting or sending a new message:", error);
                        return;
                    }
                }
            }
        } catch (error) {
            console.error("Error occurred while querying the database:", error);
            throw error;
        }
    },
};