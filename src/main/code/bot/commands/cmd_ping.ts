import CommandContext from "./context";

module.exports = {
    name: 'ping',
    description: 'Ping Pong!',
    execute(context: CommandContext, args: string[]) {
        context.message.channel.send('Pong!');
    }
}