interface Serializable<T> {
    deserialize(input: Object): T;
    serialize(): Object;
}

export class ServerSettings implements Serializable<ServerSettings> {
    prefix: string = '!';

    deserialize(input: string): ServerSettings {
        let inputJson = JSON.parse(input);
        this.prefix = inputJson.prefix;

        return this;
    }

    serialize(): string {
        let result = Object();
        result.prefix = this.prefix;

        return JSON.stringify(result);
    }

}