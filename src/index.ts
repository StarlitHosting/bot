import { dirname, importx } from "@discordx/importer";
import { IntentsBitField } from "discord.js";
import { StarlitClient } from "./structures/StarlitClient.js";
import mongoose from "mongoose";
import 'dotenv/config';

const client = new StarlitClient({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers
    ],
    silent: true
});

async function run() {
    ["TOKEN", "MONGO_URL", "DASHBOARD_URL", "DASHBOARD_KEY"].forEach((envVariable) => {
        if(!process.env[envVariable]) throw new Error(`Could not find environment variable: ${envVariable}.`)
    });

    await mongoose.connect(process.env.MONGO_URL as string);
    
    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);
    
    await client.login(process.env.TOKEN as string)
}

await run();
