import { EmbedBuilder } from "discord.js";
import { Client, ClientOptions } from "discordx";

export class StarlitClient extends Client {
    public log: Logger = new Logger(this)

    constructor(options: ClientOptions) {
        super(options);
    }
}

class Logger {
    private client: StarlitClient;
    private logChannelId = "1141800359044591616";

    constructor(client: StarlitClient) {
        this.client = client;
    }

    async error(message: string) {
        console.log("EE")
        const channel = await this.client.channels.fetch(this.logChannelId);

        const embed = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle("🌋 Bot Error")
            .setDescription(message);

        if (channel?.isTextBased()) channel.send({ embeds: [embed] })
    }
}