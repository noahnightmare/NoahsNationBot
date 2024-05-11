const { Message } = require("discord.js");
const Utils = require("../utils.js");

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        // Iterate through the entries in the gifted log
        for (const giftedUserId in Utils.giftedLog) {
            // Get the gifter user's ID from the entry value
            const gifterUserId = Utils.giftedLog[giftedUserId];
            
            // Check if the gifted user or the gifter left the server
            if (giftedUserId === member.id || gifterUserId === member.id) {
                if (gifterUserId == member.id) {
                    const giftedMember = member.guild.members.cache.get(giftedUserId);
                    await giftedMember.roles.remove(Utils.giftedRoleId);
                }

                // Remove the entry from the gifted log
                delete Utils.giftedLog[giftedUserId];

                Utils.saveGiftedLog();
            }
        }

        for (const customRoleUserId in Utils.customRoleLog) {
            const customRoleId = Utils.customRoleLog[customRoleUserId];

            if (customRoleUserId === member.id) {
                const customRole = await member.guild.roles.fetch(customRoleId);
                if (customRole) {
                    customRole.delete();
                }
            }

            delete Utils.customRoleLog[customRoleUserId];

            Utils.saveCustomRoleLog();
        }
    },
};