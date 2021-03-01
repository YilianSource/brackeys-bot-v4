import { MessageEmbed } from "discord.js";
import { Command } from "../structures/classes/command";
import { Scope } from "../structures/enums/scopes";

export default new Command({
    name: "ping",
    description: "Tells you the bot's ping",
    usage: "{p}ping",
    example: "{p}ping",
    scopes: [Scope.Pinger],
    cd: 1000,
    aliases: ["p"],
    async execute({ bot }, msg) {
        const pinging = await msg.channel.send(`🏓 Pinging...`);

        const embed = new MessageEmbed()
            .setColor(`#3B88C3`)
            .setTitle(`🏓 Pong!`)
            .setDescription(
                `Bot Latency is **${Math.floor(
                    pinging.createdTimestamp - msg.createdTimestamp
                )} ms** \nAPI Latency is **${Math.round(bot.ws.ping)} ms**`
            );

        pinging.delete();
        await msg.channel.send(embed);
    },
});
