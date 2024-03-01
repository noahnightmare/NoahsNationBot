const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection } = require(`discord.js`);
const fs = require('fs');
const { token } = require("./config.json");
const Utils = require("./utils.js");

Utils.client.commands = new Collection();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(Utils.client);
    }
    Utils.client.handleEvents(eventFiles, "./src/events");
    Utils.client.handleCommands(commandFolders, "./src/commands");
    Utils.client.login(token)
})();