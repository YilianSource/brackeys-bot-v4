import { MessageEmbed } from "discord.js";
import { Command } from "../structures/classes/command";
import { ArgumentType } from "../structures/enums/argument-type";
import { Scope } from "../structures/enums/scopes";

export default new Command({
    name: "prefix",
    description: "Changes the bot's prefix",
    usage: "{p}prefix [new-prefix]",
    example: `{p}prefix ?
              {p}prefix "a b c"`,
    scopes: [Scope.Moderator],
    cd: 1000,
    aliases: ["p"],
    args: [ArgumentType.String],
    async execute({ guildState, guildStateRepo }, msg, args) {
        guildState.prefix = args[0];
        guildStateRepo.save(guildState);

        msg.channel.send(
            `Prefix for ${msg.guild.name} is now set to **${args[0]}**.`
        );
    },
});
