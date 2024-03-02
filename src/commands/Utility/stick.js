const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Utils  = require('../../utils');
const stickySchema = require('../../Schemas/stickySchema');

const stickCommand = new SlashCommandBuilder()
    .setName('stick')
    .setDescription('Creates a sticky message in the current channel')
    .addStringOption(option => 
        option.setName('message')
        .setDescription('The message you want to stick to the chat.')
        .setRequired(true))
    .addNumberOption(option => 
        option.setName('count')
        .setDescription('How frequently you want the sticky message to be sent.')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    

const handleStickInteraction = async interaction => {
    // Grab initial values from command
    let string = interaction.options.getString("message");
    let amount = interaction.options.getNumber('count') || 1;

    // Build the sticky message embed
    const embed = new EmbedBuilder()
    .setColor("#000000")
    .setDescription(string)
    .setFooter({ text: "Noah's Nation Sticky Messages "})

    try {
        const data = await stickySchema.findOne({ ChannelID: interaction.channel.id }).exec();
    
        if (!data) {
            let msg = await interaction.channel.send({ embeds: [embed] });
    
            await stickySchema.create({
                ChannelID: interaction.channel.id,
                Message: string,
                MaxCount: amount,
                LastMessageID: msg.id,
            });
    
            return await interaction.reply({ content: "Sticky message created", ephemeral: true });
        } else {
            return await interaction.reply({ content: "You already have a sticky message setup within this channel, use /unstick to remove it", ephemeral: true });
        }
    } catch (error) {
        console.error("Error occurred while querying the database or creating sticky message:", error);
        throw error; 
    }
};

// Export the command and interaction handler
module.exports = {
    data: stickCommand,
    execute: handleStickInteraction
};