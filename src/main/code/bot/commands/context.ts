import {ServerSettings} from "../../db/server_settings";
import {Message} from "discord.js";

export default class CommandContext {
    serverSettings: ServerSettings;
    message: Message;

    constructor(serverSettings: ServerSettings, message: Message) {
        this.serverSettings = serverSettings;
        this.message = message;
    }
}