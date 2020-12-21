import CommandContext from "./context";
import {setGuildSettings} from "../../db";
import set = Reflect.set;

module.exports = {
    name: 'prefix',
    description: 'Change the prefix of the server',
    execute(context: CommandContext, args: string[]) {
        let newPrefix = args[0];
        let settings = context.serverSettings;
        settings.prefix = newPrefix;
        let result = setGuildSettings(BigInt(context.message.guild?.id), settings);

        result.then(() => {
            context.message.channel.send(`Set the new prefix to ${newPrefix}`);
        }).catch(() => {
            context.message.channel.send('Failure to change the prefix');
        })
    }
}