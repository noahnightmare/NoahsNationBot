const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const Utils = require('../../utils');

const customRoleCommand = new SlashCommandBuilder()
    .setName('customrole')
    .setDescription('Create or edit a custom role')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('Name of the custom role')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('colour')
            .setDescription('Hexadecimal color code for the custom role')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('image')
            .setDescription('Image URL for the custom role icon')
            .setRequired(false)); 

const handleCustomRoleInteraction = async interaction => {
    if (!interaction.isCommand()) return;

    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (member.roles.cache.some(role => role.id === Utils.customRoleCommandRoleId)) {
        const roleName = interaction.options.getString('name');
        const roleColor = interaction.options.getString('colour');
        const roleImage = interaction.options.getString('image');

        if (!Utils.isValidHexColor(roleColor)) {
            await interaction.reply('Please provide a valid hexadecimal colour for the custom role.');
            return;
        }

        if (!roleName || !roleColor) {
            await interaction.reply('Please provide a name and a hex color for the custom role.');
            return;
        }

        let existingRoleId = Utils.customRoleLog[interaction.member.id];
        let createdRole;

        if (existingRoleId) {
            const existingRole = await interaction.guild.roles.fetch(existingRoleId);
            if (existingRole) {
                await existingRole.setName(roleName);
                await existingRole.setColor(roleColor);

                if (roleImage && roleImage.toLowerCase() !== 'none') {
                    if (roleImage.startsWith('http')) {
                        await existingRole.setIcon(roleImage);
                      } else {
                        try {
                          const attachment = interaction.options.get('image').value;
                          if (attachment) {
                            const imageBuffer = await fetch(attachment).then((response) => response.buffer());
                            await existingRole.setIcon(imageBuffer);
                          }
                        } catch (error) {
                          console.error('Error setting role icon:', error.message);
                          await existingRole.setIcon(null); // Set role icon to null if there's an error
                        }
                      }
                } else {
                    await existingRole.setIcon(null);
                }

                await interaction.reply(`Custom role "${roleName}" edited.`);
                Utils.saveCustomRoleLog();
            } else {
                await interaction.reply('Error editing custom role. Please try again.');
            }
        } else {
            try {
                createdRole = await interaction.guild.roles.create({
                    name: roleName,
                    color: roleColor,
                    permissions: [],
                });

                // Set the role position below the bot's highest role
                const botMember = await interaction.guild.members.fetch(Utils.client.user.id);
                await createdRole.setPosition(botMember.roles.highest.position - 1);

                // Set the role icon (link or uploaded file)
                if (roleImage && roleImage.toLowerCase() !== 'none') {
                if (roleImage.startsWith('http')) {
                    await createdRole.setIcon(roleImage);
                } else {
                    try {
                    const attachment = interaction.options.get('image').value;
                    if (attachment) {
                        const imageBuffer = await fetch(attachment).then((response) => response.buffer());
                        await createdRole.setIcon(imageBuffer);
                    }
                    } catch (error) {
                    console.error('Error setting role icon:', error.message);
                    await createdRole.setIcon(null); // Set role icon to null if there's an error
                    }
                }
                }

                // Log the custom role assignment
                Utils.customRoleLog[interaction.member.id] = createdRole.id;
                Utils.saveCustomRoleLog();

                // Add the custom role to the user
                await interaction.member.roles.add(createdRole);

                await interaction.reply(`Custom role "${roleName}" created and assigned.`);
            } catch (error) {
                console.error('Error creating custom role:', error.message);
                await interaction.reply('Error creating custom role. Please try again.');
            }
        }
    } else {
        await interaction.reply('You do not have the required role to do this.');
    }
};

module.exports = {
    data: customRoleCommand,
    execute: handleCustomRoleInteraction
};