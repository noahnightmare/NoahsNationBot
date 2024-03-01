const { ActivityType } = require('discord.js');
const Utils = require('../utils.js');


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        async function pickPresence () {
            try {

                await client.user.setPresence({
                    status: 'dnd',
                  });

                await client.user.setActivity('Noah\'s Nation...', {
                       type: ActivityType.Watching,
                   });

            } catch (error) {
                console.error(error);
            }
        }

        await pickPresence();

        // Check and remove gifted roles for users who lost the patreon role
        for (const giftedUserId in Utils.giftedLog) {
            const gifterUserId = Utils.giftedLog[giftedUserId];

            const gifterMember = await client.guilds.cache.get('1178699846828433450').members.fetch(gifterUserId);
            if (!gifterMember || (!gifterMember.roles.cache.has(Utils.patreonRoleId) && !gifterMember.roles.cache.has(Utils.patreonRoleId2))) {
                const giftedMember = await client.guilds.cache.get('1178699846828433450').members.fetch(giftedUserId);
                if (giftedMember) {
                    await giftedMember.roles.remove(Utils.giftedRoleId);
                }

                console.log("Invalid entry found and deleted in GiftedLog");
                // Remove the entry from the giftedLog
                delete Utils.giftedLog[giftedUserId];
            }
        }
        
        // Check and remove custom roles for users who lost the customRoleCommandRoleId
        for (const userId in Utils.customRoleLog) {
            const member = await client.guilds.cache.get('1178699846828433450').members.fetch(userId);

            if (!member || !member.roles.cache.has(Utils.customRoleCommandRoleId)) {
                const customRoleIdToRemove = Utils.customRoleLog[userId];
                if (customRoleIdToRemove) {
                    const customRole = await member.guild.roles.fetch(Utils.customRoleIdToRemove);
                    if (customRole) {
                    // Send a message to the channel notifying the user
                    await member.guild.channels.cache.get('1178789970257915915').send(`Custom role removed from ${member.toString()}`);
                    
                    // Delete the custom role
                    await customRole.delete();
                    }

                    console.log("Invalid entry found and deleted in GiftedLog");
                    // Remove the entry from the customRoleLog
                    delete Utils.customRoleLog[userId];
                }
            }
        }

        // Save the updated customRoleLog to the file
        Utils.saveCustomRoleLog();

        // Save the updated giftedLog to the file
        Utils.saveGiftedLog();

        console.log('Ready!');
    },
};