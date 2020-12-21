import { Client, MessageEmbed } from "discord.js";
import fs from 'fs';
import path from 'path';
import {getGuildSettings} from "../db";
import CommandContext from "./commands/context";
import {ServerSettings} from "../db/server_settings";

require('dotenv').config({ path: path.join(process.cwd(), ".env") });

let client = new Client();

let commands = new Map();
let guildPrefixes = new Map();

for (let file of fs.readdirSync(__dirname + '/commands').filter(file => file.startsWith('cmd_'))) {
    console.log(`Found command ${file}, registering...`)
    let command = require(__dirname + `/commands/${file}`);
    commands.set(command.name, command);
}

client.on('ready', function() {
    console.log('Bot is up and running!')
});

client.on('message', async function (msg) {
    if (msg.author.bot) return;

    let settings = await getGuildSettings(BigInt(msg.guild?.id));

    let content = msg.content;
    let guildPrefix = settings.prefix;

    if (content.startsWith(guildPrefix)) {
        let commandParts = content.split(' ');
        let command = commandParts[0].substr(guildPrefix.length);

        let context = new CommandContext(settings, msg);

        try {
            commands.get(command).execute(context, commandParts.slice(1));
        } catch (e) {
            msg.reply('Oh no, something went wrong: ' + e);
        }

        // if (command === 'prefix') {
        //     let newPrefix = commandParts[1];
        //     guildPrefixes.set(msg.guild?.id, newPrefix);
        //     msg.channel.send('Set the prefix to ' + newPrefix);
        // } else if (command === 'ping') {
        //     msg.channel.send('pong!');
        // } else if (command === 'stalk') {
        //     let members = '';
        //     msg.guild?.members.cache.forEach(function(key, value) {
        //         members += key.displayName + ', ';
        //     })
        //
        //     msg.channel.send('I was able to find these members: ' + members);
        // }
    }
})

client.login(process.env.BOT_TOKEN || '');