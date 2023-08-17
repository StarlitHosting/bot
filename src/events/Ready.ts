import { Events } from "discord.js";
import { Client, Discord, Once } from "discordx";

@Discord()
export class Ready {

    @Once({ event: Events.ClientReady })
    async onReady([client]: [Client]) {
        console.log("Bot Online!")

        await client.initApplicationCommands();
    }

}