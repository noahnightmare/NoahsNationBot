const { Events, EmbedBuilder } = require('discord.js');
const starboard = require('../Schemas/starboardSchema.js');
const Utils = require("../utils.js");
const _ = require('lodash'); // required to halt execution until its stopped being called

const debouncedExecute = _.debounce(async (reaction, user, client) => {
    if (!reaction.message.guildId) return;

        var data = await starboard.findOne({ Guild: reaction.message.guildId });
        if (!data) return;
        else {
            if (reaction._emoji.name !== Utils.starboardEmoji) return;

            var guild = await client.guilds.cache.get(reaction.message.guildId);
            // channel to send the starboard message to
            var sendChannel = await guild.channels.fetch(data.Channel);
            // channel where the reaction was logged
            var channel = await guild.channels.fetch(reaction.message.channelId);
            var message = await channel.messages.fetch(reaction.message.id);
            const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.first().url) : ""; 
            // nullifies if its empty
            const imageUrl = image || null;

            if (message.author.id === client.user.id || Utils.ignoredStarboardChannels.includes(channel.id)) return;

            if (reaction.emoji.name !== Utils.starboardEmoji) return;

            var starReaction = await message.reactions.cache.find(reaction => reaction.emoji.name === Utils.starboardEmoji);
            if (starReaction.count < data.Count) return;

            const msg = message.content || 'No content available';
            const originalMessageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;

            const embed = new EmbedBuilder()
                .setColor("#000000")
                .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
                .setDescription(`\n${msg} \n\n **[Click to view original message](${originalMessageLink})**`)
                .setFooter({ text: `Noah's Nation | ${message.id}`})
                .setImage(imageUrl)
                .setTimestamp();

            const starboardMessage = await sendChannel.messages.fetch({ limit: 100 })
                .then(messages => messages.find(m => m.embeds.length > 0 && m.embeds[0].footer && m.embeds[0].footer.text.endsWith(message.id)));

            if (starboardMessage) {
                const starMsg = await sendChannel.messages.fetch(starboardMessage.id);
                await starMsg.edit({ content: `**${Utils.starboardEmoji} ${starReaction.count} | ${channel}**`, embeds: [embed] });
            } else {
                await sendChannel.send({ content: `**${Utils.starboardEmoji} ${starReaction.count} | ${channel}**`, embeds: [embed] })
                    .then(async m => {
                        await m.react(Utils.starboardEmoji).catch(err => {});
            });
        }
    }
}, 1000);

module.exports = {
    name: Events.MessageReactionAdd,
    async execute (reaction, user, client) {
        debouncedExecute(reaction, user, client);
    },

    // checks if anything is attached to the message
    extension(reaction, attachment) {
        const imageLink = attachment.split(".");
        const typeOfImage = imageLink[imageLink.length - 1];
        const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
        if (!image) return "";
        return attachment;
    }
}

