const fs = require('fs');
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection } = require(`discord.js`);
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers] }); 

const customEmoji1 = '<:yes:1180098342584332318>';
const customEmoji2 = '<:no:1180098352730345483>';

const ignoredRoleId = '1178782630112665610';
const ignoredGiftedRoleIds = ['1178788909950435379', '1178791501493448714', '1179539873338757200'];
const patreonRoleId = '1180267154378068048';
const patreonRoleId2 = '1180266771333263431';
const giftedRoleId = '1180272964420251739';
const customRoleCommandRoleId = '1180267154378068048';
const giftedLogFile = 'src/gifted_log.json';
const customRoleLogFile = 'src/custom_role_log.json';

const starboardEmoji = '⭐';

const ignoredStarboardChannels = [
    '1178699849466662925',
    '1178712415370743928',
    '1187872325534761040',
    '1178946972355416145',
    '1187872875890352178',
    '1188181177740312590',
    '1223981132337647616',
    '1202645211872755722',
    '1178804895713853490',
    '1181615777154093138',
    '1178783996138770432',
    '1203067883740209232',
    '1180268049941659668'
];

let giftedLog = loadGiftedLog(); 
let customRoleLog = loadCustomRoleLog(); 

function loadGiftedLog() {
    try {
        if (fs.existsSync(giftedLogFile)) {
            const fileContent = fs.readFileSync(giftedLogFile, 'utf-8');
            console.log('Successfully read Gifted logs.')
            return JSON.parse(fileContent);
        } else {
            fs.writeFileSync(giftedLogFile, '{}');
            return {};
        }
    } catch (error) {
      console.error('Error loading gifted log:', error.message);
      return {};
    }
}
  
function saveGiftedLog() {
    fs.writeFileSync(giftedLogFile, JSON.stringify(giftedLog));
}

function isValidHexColor(color) {
    const hexColorRegex = /^#?([0-9A-Fa-f]{3}){1,2}$/;
    return hexColorRegex.test(color);
  }
  
function loadCustomRoleLog() {
    try {
        if (fs.existsSync(customRoleLogFile)) {
        const fileContent = fs.readFileSync(customRoleLogFile, 'utf-8');
        console.log('Successfully read CustomRole logs.')
        return JSON.parse(fileContent);
        } else {
        fs.writeFileSync(customRoleLogFile, '{}');
        return {};
        }
    } catch (error) {
        console.error('Error loading custom role log:', error.message);
        return {};
    }
}

function saveCustomRoleLog() {
    fs.writeFileSync(customRoleLogFile, JSON.stringify(customRoleLog));
}
  

module.exports = { 
    client,
    customEmoji1,
    customEmoji2,
    ignoredRoleId, 
    ignoredGiftedRoleIds, 
    patreonRoleId, 
    patreonRoleId2, 
    giftedRoleId, 
    customRoleCommandRoleId, 
    giftedLogFile, 
    customRoleLogFile, 
    ignoredStarboardChannels,
    starboardEmoji,
    giftedLog, 
    customRoleLog, 
    loadGiftedLog, 
    saveGiftedLog,
    isValidHexColor,
    loadCustomRoleLog,
    saveCustomRoleLog
};