import * as typeorm from "typeorm";
import { Client, Collection } from "discord.js";
import { readdir } from "fs";
import { Command } from "./structures/classes/command";
import config from "./util/global";

export const bot: Client = new Client({
    restTimeOffset: 0,
});

export { config };

export const commands: Collection<string, Command> = new Collection<
    string,
    Command
>();

readdir(`${__dirname}/commands`, (err, files) => {
    if (err) return console.error;
    files.forEach((file: string) => {
        if (!file.endsWith(`.js`)) return;
        const command: Command = require(`${__dirname}/commands/${file}`)
            .default;
        commands.set(command.name, command);
    });
});

readdir(`${__dirname}/events/`, (err, files) => {
    if (err) return console.error;
    files.forEach((file: string) => {
        if (!file.endsWith(`.js`)) return;
        const event: () => any = require(`${__dirname}/events/${file}`).default;
        const eventName: string = file.split(`.`)[0];
        bot.on(eventName, event.bind(null, bot));
    });
});

typeorm
    .createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: config.MYSQL_USER,
        password: config.MYSQL_PASS,
        database: config.MYSQL_DB_NAME,
        entities: [__dirname + "/database/entity/**/*.js"],
        migrations: [__dirname + "/database/migration/**/*.js"],
        subscribers: [__dirname + "/database/subscriber/**/*.js"],
        synchronize: true,
    })
    .then((connection) => {
        console.log(`Connected to ${connection.driver.database} database!`);
    })
    .catch((err) => {
        console.error(err);
    });
bot.login(config.BOT_TOKEN);
