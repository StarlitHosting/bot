import { EmbedBuilder, Events } from "discord.js";
import { ArgsOf, Client, Discord, On } from "discordx";

@Discord()
export class InteractionCreate {

    @On({ event: Events.InteractionCreate })
    async onInteractionCreate([interaction]: ArgsOf<Events.InteractionCreate>, client: Client) {
        try {
            await client.executeInteraction(interaction)
        } catch (e) {
            console.log(e)
            if(interaction.isRepliable() && !interaction.replied) {
                const embed = new EmbedBuilder()
                .setTitle("Error Occured")
                .setDescription("An error occured executing this command! Please try again.")
                .setFooter({ text: "If this issue persists feel free to contact us!" })
                .setColor("#facc15");

                interaction.reply({ embeds: [embed] })
            }
        }
    }

}