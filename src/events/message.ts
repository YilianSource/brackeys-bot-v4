import { Client, Message, MessageEmbed } from "discord.js";
import { getRepository } from "typeorm";
import { commands } from "..";
import { GuildState } from "../database/entity/GuildState";
import { MemberState } from "../database/entity/MemberState";
import { Command, testArgument } from "../structures/classes/command";
import { ArgumentType } from "../structures/enums/argument-type";
import { CommandType } from "../structures/enums/command-type";
import { Scope } from "../structures/enums/scopes";

let recentCommands: Array<string> = [];

export default async (bot: Client, msg: Message) => {
    if (msg.author.bot) return;

    const guildStateRepo = getRepository(GuildState);
    const guildState = await guildStateRepo
        .findOneOrFail({ where: { guildId: msg.guild.id } })
        .catch(async () => {
            const newGuildState = new GuildState();
            newGuildState.guildId = msg.guild.id;
            newGuildState.name = msg.guild.name;
            await guildStateRepo.save(newGuildState);

            return newGuildState;
        });
    if (guildState.name != msg.guild.name) {
        guildState.name = msg.guild.name;
        await guildStateRepo.save(guildState);
    }

    let args: Array<string> = msg.content
        .substring(guildState.prefix.length)
        .match(/\\?.|^$/g)
        .reduce(
            (p: any, c) => {
                if (c === '"') {
                    p.quote ^= 1;
                } else if (!p.quote && c === " ") {
                    p.a.push("");
                } else {
                    p.a[p.a.length - 1] += c.replace(/\\(.)/, "$1");
                }
                return p;
            },
            { a: [""] }
        ).a;

    let message: string = msg.content.substring(0);

    if (message.substring(0, guildState.prefix.length) == guildState.prefix) {
        if (commands.has(args[0])) {
            const memberStateRepo = getRepository(MemberState);
            const memberState = await memberStateRepo
                .findOneOrFail({
                    where: {
                        memberId: msg.author.id,
                        guildState: guildState,
                    },
                })
                .catch(async () => {
                    const newMemberState = new MemberState();
                    newMemberState.memberId = msg.author.id;
                    newMemberState.guildState = Promise.resolve(guildState);
                    await memberStateRepo.save(newMemberState);

                    return newMemberState;
                });

            try {
                const command: Command =
                    commands.get(args[0]) ||
                    commands.find((cmd) => cmd.aliases.includes(args[0]));
                if (command.type == CommandType.Guild && !msg.guild) {
                    return msg.channel.send(
                        `Commands can only be used in a guild.`
                    );
                }
                if (recentCommands.includes(`${msg.author.id}-${args[0]}`)) {
                    return msg.channel.send(
                        `Please wait a while before using this command again.`
                    );
                }

                const memberScopes = [
                    ...memberState.scopes(),
                    ...guildState
                        .rolesScopes()
                        .filter((roleScope) =>
                            msg.member.roles.cache.has(roleScope.roleId)
                        )
                        .map((roleScope) => roleScope.scopes)
                        .reduce((a, b) => a.concat(b)),
                ];

                /* Explicityly add scopes if the member has specific permissions */
                if (msg.member.hasPermission("ADMINISTRATOR")) {
                    memberScopes.push(Scope.Admin);
                }
                if (msg.member.hasPermission("MANAGE_GUILD")) {
                    memberScopes.push(Scope.Moderator);
                }

                if (
                    !(
                        memberScopes.some((scope) =>
                            command.scopes.includes((Scope as any)[scope])
                        ) || memberScopes.includes((Scope as any)[Scope.Admin])
                    )
                ) {
                    return msg.channel.send(`Access denied.`);
                }

                const helpEmbed: MessageEmbed = new MessageEmbed()
                    .setTitle(`Command: ${guildState.prefix}${args[0]}`)
                    .setDescription(
                        `**Description: **` +
                            command.description.replace(
                                /{p}/g,
                                guildState.prefix
                            ) +
                            `\n` +
                            (command.aliases.length > 0
                                ? `**Aliases: **` +
                                  command.aliases.join(", ") +
                                  "\n"
                                : "") +
                            `**Usage: **` +
                            (command.usage.includes(`\n`) ? `\n` : ``) +
                            command.usage
                                .replace(/{p}/g, guildState.prefix)
                                .replace(/(?<=\n) +/g, "") +
                            `\n` +
                            `**Examples: **` +
                            (command.example.includes(`\n`) ? `\n` : ``) +
                            command.example
                                .replace(/{p}/g, guildState.prefix)
                                .replace(/(?<=\n) +/g, "")
                    );

                if (
                    !command.args.every((argTypes, index) => {
                        if (index == 0) return true;
                        if (!Array.isArray(argTypes)) {
                            argTypes = [(argTypes as unknown) as ArgumentType];
                        }
                        return (argTypes as Array<ArgumentType>).some(
                            (argType) => testArgument(argType, args[index])
                        );
                    })
                ) {
                    return msg.channel.send(helpEmbed);
                }
                recentCommands.push(`${msg.author.id}-${args[0]}`);

                setTimeout(() => {
                    recentCommands = recentCommands.filter(
                        (r) => r != `${msg.author.id}-${args[0]}`
                    );
                }, command.cd);

                await command.execute(
                    {
                        bot,
                        guildState,
                        guildStateRepo,
                        memberState,
                        memberStateRepo,
                    },
                    msg,
                    args.slice(1),
                    helpEmbed,
                    () => {
                        recentCommands = recentCommands.filter(
                            (r) => r != `${msg.author.id}-${args[0]}`
                        );
                    }
                );
            } catch (err) {
                console.warn(err);
                msg.channel
                    .send(
                        `Congrats! You found an error when using the ${args[0]} command!`
                    )
                    .catch(() => {});
            }
        }
    }
};
