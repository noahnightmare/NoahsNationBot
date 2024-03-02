const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Utils  = require('../../utils');
const stickySchema = require('../../Schemas/stickySchema');

const stickCommand = new SlashCommandBuilder()
    .setName('unstick')
    .setDescription('Unsticks a sticky message in the current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    

const handleStickInteraction = async interaction => {

    const data = await stickySchema.findOne({ ChannelID: interaction.channel.id });

    if (!data) {
        return await interaction.reply({ content: "There is no sticky message in this channel.", ephemeral: true})
    }
    else {
        try {
            interaction.client.channels.cache.get(data.ChannelID).messages.fetch(data.LastMessageID).then(async(m) => {
                await m.delete();
            })
        }
        catch {
            return;
        }
    }

    try {
        const result = await stickySchema.deleteMany({ ChannelID: interaction.channel.id }).exec();
        
        if (result.deletedCount > 0) {
            return await interaction.reply({ content: "The current sticky message in this channel has been deleted.", ephemeral: true });
        } else {
            return await interaction.reply({ content: "There is no sticky message to delete in this channel.", ephemeral: true });
        }
    } catch (error) {
        console.error("Error occurred while deleting the sticky message:", error);
        throw error; 
    }
};

// Export the command and interaction handler
module.exports = {
    data: stickCommand,
    execute: handleStickInteraction
};