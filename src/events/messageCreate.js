const { Message } = require("discord.js");
const client = require("../index.js");
const Utils = require("../utils.js");

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
    },
};