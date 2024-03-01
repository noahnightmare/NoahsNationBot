const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const Utils  = require('../../utils');

const giftedCommand = new SlashCommandBuilder()
    .setName('gifted')
    .setDescription('Allows a Patreon Tier 3 or 4 user to gift another user a rank for free!')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to gift the role')
            .setRequired(true));

const handleGiftedInteraction = async interaction => {

    if (!interaction.isCommand()) return; // possibly not necessary

    const mentionedUser = interaction.options.get('user').member;
    const mentionedMember = interaction.guild.members.cache.get(mentionedUser.id);

    if (!mentionedMember) {
        await interaction.reply('Please mention a user to gift the role.');
        return;
    }
    
    // Checks if sender has patreon tier 3 or 4
    if (interaction.member.roles.cache.some(role => role.id == Utils.patreonRoleId || role.id == Utils.patreonRoleId2)) {

        // Checks if receiver already has gifted
        if (mentionedMember.roles.cache.has(Utils.giftedroleId)) {
            await interaction.reply(`${mentionedMember.user.tag} already has the Gifted role.`);
            return;
        }

        // Checks if receiver has a blacklisted role
        if (Utils.ignoredGiftedRoleIds.some(roleId => mentionedMember.roles.cache.has(roleId))) {
            await interaction.reply('This user cannot be given the Gifted role.');
            return;
        }

        // Remove the gifted role from the previous user, if any
        for (const giftedUserId in Utils.giftedLog) {
            if (Utils.giftedLog[giftedUserId] == interaction.user.id) {
                const previousGiftedMember = await interaction.guild.members.fetch(giftedUserId);
                if (previousGiftedMember) {
                    await interaction.channel.send(`Gifted role removed from ${previousGiftedMember.toString()}`);
                    await previousGiftedMember.roles.remove(Utils.giftedRoleId);
                }
                delete Utils.giftedLog[giftedUserId];
                break;
            }
        }

        // Add the role to the mentioned user
        await mentionedMember.roles.add(Utils.giftedRoleId);

        // Log the interaction externally
        Utils.giftedLog[mentionedMember.id] = interaction.user.id;
        Utils.saveGiftedLog();

        // Send a message to the channel notifying the new user
        await interaction.reply(`${interaction.user.toString()} has given the Gifted role to ${mentionedMember.toString()}!`);
    }
    else { await interaction.reply('You do not have the required role to use this command.'); }
};

// Export the command and interaction handler
module.exports = {
    data: giftedCommand,
    execute: handleGiftedInteraction
};