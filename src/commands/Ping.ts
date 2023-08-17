import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Discord, Slash } from "discordx";
import { StarlitClient } from "../structures/StarlitClient.js";

@Discord()
export class Ping {

    @Slash({ description: "Check the bots ping" })
    async ping(interaction: CommandInteraction, client: StarlitClient) {
        const embed = new EmbedBuilder()
        .setTitle("📡 Ping")
        .setDescription("Calculating...")
        .setColor("#facc15");

        const sentMessage = await interaction.reply({ embeds: [embed] })

        embed.setDescription(`**API**: \`${client.ws.ping}ms\`\n**Bot:** \`${sentMessage.createdTimestamp - interaction.createdTimestamp}ms\``)
        sentMessage.edit({ embeds: [embed]})
    }
    
}