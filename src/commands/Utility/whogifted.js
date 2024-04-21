const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const Utils  = require('../../utils');

const whogiftedCommand = new SlashCommandBuilder()
    .setName('whogifted')
    .setDescription('Check who gifted a user.')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to check.')
            .setRequired(true));

const handleWhoGiftedInteraction = async interaction => {

    if (!interaction.isCommand()) return; // possibly not necessary

    const mentionedUser = interaction.options.get('user').member;
    const mentionedMember = interaction.guild.members.cache.get(mentionedUser.id);

    if (!mentionedMember) {
        return await interaction.reply({ content: "Please mention a user to check.", ephemeral: true });
    }

    if (!Utils.giftedLog[mentionedMember.id]) {
        return await interaction.reply({ content: `${mentionedMember.toString()} is not currently gifted.`, ephemeral: true });
    }

    const gifterUserId = Utils.giftedLog[mentionedMember.id];

    try {
        const gifterMember = await interaction.guild.members.fetch(gifterUserId);


        await interaction.reply({ content: `🎁 **${mentionedMember.user.displayName}** [ ${mentionedMember.user.tag} ] was gifted by **${gifterMember.displayName}** [ ${gifterMember.user.tag} ]`, ephemeral: false });
    }
    catch(error) {
        console.error("Error fetching gifter member");
        await interaction.reply("There was an error fetching gifter member! They are probably not in the server <@721044801436516372>");
    }

    return;
};

// Export the command and interaction handler
module.exports = {
    data: whogiftedCommand,
    execute: handleWhoGiftedInteraction
};