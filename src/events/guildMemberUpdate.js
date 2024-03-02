const { Message } = require("discord.js");
const Utils = require("../utils.js");

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        // Check if the user lost the patreon role
        const lostPatreonRole = oldMember.roles.cache.has(Utils.patreonRoleId) || oldMember.roles.cache.has(Utils.patreonRoleId2);
        const hasPatreonRoleNow = newMember.roles.cache.has(Utils.patreonRoleId) || newMember.roles.cache.has(Utils.patreonRoleId2);

        if (lostPatreonRole && !hasPatreonRoleNow) {
            // Remove gifted roles for the user
            const giftedRoleIdToRemove = Object.keys(Utils.giftedLog).find(giftedUserId => Utils.giftedLog[giftedUserId] === newMember.id);
            if (giftedRoleIdToRemove) {
                const giftedMember = await newMember.guild.members.fetch(giftedRoleIdToRemove);
                if (giftedMember) {
                    await giftedMember.roles.remove(Utils.giftedRoleId);
                }

                // Remove the entry from the giftedLog
                delete Utils.giftedLog[giftedRoleIdToRemove];
                
                Utils.saveGiftedLog();
            }
        }
        
        // Check if the user lost the customRoleCommandRoleId
        const lostCustomRoleCommandRole = oldMember.roles.cache.has(Utils.customRoleCommandRoleId);
        const hasCustomRoleCommandRoleNow = newMember.roles.cache.has(Utils.customRoleCommandRoleId);

        if (lostCustomRoleCommandRole && !hasCustomRoleCommandRoleNow) {
            // Remove custom role for the user
            const customRoleIdToRemove = Utils.customRoleLog[newMember.id];
            if (customRoleIdToRemove) {
                const customRole = await newMember.guild.roles.fetch(customRoleIdToRemove);
                if (customRole) {
                    // Send a message to the channel notifying the user
                    await newMember.guild.channels.cache.get('1178789970257915915').send(`Custom role removed from ${newMember.toString()}`);
                    
                    // Delete the custom role
                    await customRole.delete();
                }

                // Remove the entry from the customRoleLog
                delete Utils.customRoleLog[newMember.id];

                // Save the updated customRoleLog to the file
                Utils.saveCustomRoleLog();
            }
        }
    },
};