import { EmbedBuilder, Events } from "discord.js";
import { ArgsOf, Discord, On } from "discordx";
import { StarlitClient } from "../structures/StarlitClient.js";
import constants from "../constants.js";

@Discord()
export class GuildMemberAdd {

    @On({ event: Events.GuildMemberAdd })
    async onGuildMemberAdd([event]: ArgsOf<Events.GuildMemberAdd>, client: StarlitClient) {
        try {
            await event.roles.add(constants.JoinRole);

            const welcomeChannel = await client.channels.fetch(constants.WelcomeChannel);

            const welcomeEmbed = new EmbedBuilder()
            .setColor("#facc15")
            .setTitle("🚍 User Joined")
            .setDescription(`**<@${event.user.id}>**, has joined the server!\n_Account Created: <t:${Math.ceil(event.user.createdTimestamp / 1000)}>_`)

            if(welcomeChannel?.isTextBased()) welcomeChannel.send({ embeds: [ welcomeEmbed ] })
        } catch (e) {
            client.log.error(`Failed to give roles to user: \`${event.user.username}\`!`)
        }
    }

}