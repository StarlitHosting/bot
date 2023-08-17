import { dirname, importx } from "@discordx/importer";
import { IntentsBitField } from "discord.js";
import { StarlitClient } from "./structures/StarlitClient.js";
import 'dotenv/config';
import mongoose from "mongoose";

export const client = new StarlitClient({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
    ],
    silent: true
});

async function run() {
    await mongoose.connect(process.env.MONGO_URL as string);
    
    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);
    
    await client.login(process.env.TOKEN as string)
}

await run();
