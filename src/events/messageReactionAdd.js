const { Events, EmbedBuilder } = require('discord.js');
const starboard = require('../Schemas/starboardSchema.js');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute (reaction, user, client) {

        if (!reaction.message.guildId) return;

        var data = await starboard.findOne({ Guild: reaction.message.guildId });
        if (!data) return;
        else {
            if (reaction._emoji.name !== '⭐') return;

            var guild = await client.guilds.cache.get(reaction.message.guildId);
            // channel to send the starboard message to
            var sendChannel = await guild.channels.fetch(data.Channel);
            // channel where the reaction was logged
            var channel = await guild.channels.fetch(reaction.message.channelId);
            var message = await channel.messages.fetch(reaction.message.id);
            const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.first().url) : ""; 
            // nullifies if its empty
            const imageUrl = image || null;

            if (message.author.id == client.user.id) return;

            var newReaction = await message.reactions.cache.find(reaction => reaction.emoji.id === reaction._emoji.id);

            if (newReaction.count >= data.Count) {
                var msg = message.content || 'No content available';
                const fetch = await sendChannel.messages.fetch({ limit: 100 }); 

                const stars = fetch.find(m => m.embeds.length > 0 && m.embeds[0].footer && m.embeds[0].footer.text.endsWith(message.id)); 

                if (stars) {
                    const foundStar = stars.embeds[0];

                    const embed = new EmbedBuilder()
                        .setColor(foundStar.color)
                        .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.avatarURL()}` })
                        .setDescription(foundStar.description)
                        .setFooter({ text: `Noah's Nation | ${message.id}`})
                        .setImage(imageUrl)
                        .setTimestamp();

                    const starMsg = await sendChannel.messages.fetch(stars.id);

                    await starMsg.edit({ content: `**⭐ ${newReaction.count} | ${channel}**`, embeds: [embed] }); 
                    return;
                }

                const embed = new EmbedBuilder()
                .setColor("#000000")
                .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.avatarURL()}` })
                .setDescription(`\n${msg} \n\n **[Click to view original message](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})**`)
                .setFooter({ text: `Noah's Nation | ${message.id}`})
                .setImage(imageUrl)
                .setTimestamp();

                await sendChannel.send({ content: `**⭐ ${newReaction.count} | ${channel}**`, embeds: [embed]})
                .then(async m => {
                    await m.react('⭐').catch(err => {});
                });
            }
        }
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

