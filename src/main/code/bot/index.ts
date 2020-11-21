import { Client } from "discord.js";

class Bot {
    client!: Client;

    public start(token: string): Promise<string> {
        this.client = new Client();

        return this.client.login(token);
    }
}

export default new Bot();