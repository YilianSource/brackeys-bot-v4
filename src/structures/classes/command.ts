import { Client, Message, MessageEmbed } from "discord.js";
import { Repository } from "typeorm";
import { GuildState } from "../../database/entity/GuildState";
import { MemberState } from "../../database/entity/MemberState";
import { ArgumentType } from "../enums/argument-type";
import { CommandType } from "../enums/command-type";
import { Scope } from "../enums/scopes";

export class Command {
    name: string;
    description: string;
    usage: string;
    example: string;
    scopes: Scope[] = [Scope.User];
    type?: CommandType = CommandType.All;
    cd?: number = 0;
    aliases?: Array<string> = [];
    args?: Array<ArgumentType | Array<ArgumentType>> = [];
    execute: (
        info: {
            bot: Client;
            guildState: GuildState;
            guildStateRepo: Repository<GuildState>;
            memberState: MemberState;
            memberStateRepo: Repository<MemberState>;
        },
        msg: Message,
        args: Array<string>,
        help: MessageEmbed,
        cdReset: () => any
    ) => any;
    constructor(opt: Command) {
        Object.assign(this, opt);
    }
}

/**
 * Tests the argument agaist an argument type and returns a boolean
 * @param argType the targetted argument type
 * @param value the value of the argument
 */

export function testArgument(argType: ArgumentType, value: string): boolean {
    switch (argType) {
        case ArgumentType.Number:
            return isNaN(+value);
        case ArgumentType.PositiveNumber:
            return isNaN(+value) && +value >= 0;
        case ArgumentType.NonZeroPositiveNumber:
            return isNaN(+value) && +value > 0;
        case ArgumentType.Integer:
            return isNaN(+value) && !value.includes(`.`);
        case ArgumentType.PositiveInteger:
            return isNaN(+value) && !value.includes(`.`) && +value >= 0;
        case ArgumentType.NonZeroPositiveInteger:
            return isNaN(+value) && !value.includes(`.`) && +value > 0;
        case ArgumentType.Alphanumeric:
            return !/[^\w ]/.test(value);
        case ArgumentType.Alphabetic:
            return !/[^a-zA-Z]/.test(value);
        case ArgumentType.Lowercase:
            return !/[^a-z]/.test(value);
        case ArgumentType.Uppercase:
            return !/[^A-Z]/.test(value);
        case ArgumentType.String:
            return true;
        case ArgumentType.MemberMention:
            return (
                value.slice(0, 2) == "<@" &&
                value[20] == ">" &&
                !isNaN(+value.slice(2, 20))
            );
        case ArgumentType.ChannelMention:
            return (
                value.slice(0, 2) == "<#" &&
                value[20] == ">" &&
                !isNaN(+value.slice(2, 20))
            );
        case ArgumentType.RoleMention:
            return (
                value.slice(0, 3) == "<@&" &&
                value[21] == ">" &&
                !isNaN(+value.slice(3, 21))
            );
        case ArgumentType.ID:
            return value.length == 18 && !isNaN(+value);
    }
}
