import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, EmbedBuilder, GuildMember, MessageActionRowComponentBuilder } from "discord.js";
import { ButtonComponent, Discord, Slash } from "discordx";
import { StarlitClient } from "../structures/StarlitClient.js";
import constants from "../constants.js";
import { getDashboardUser } from "../utils/Utils.js";

@Discord()
export class ClientRole {

    @ButtonComponent({ id: "grant_client_role" })
    async handler(interaction: ButtonInteraction) {
        const member = interaction.member as GuildMember;

        if (member.roles.cache.has(constants.ClientRole)) return interaction.reply({
            content: `You already have the <@&${constants.ClientRole}> role!`,
            ephemeral: true
        })

        const dashboardUser = await getDashboardUser(interaction.user.id);

        if (!dashboardUser) return interaction.reply({
            content: `It doesnt appear you have linked your discord account on our dashboard. Please visit ${process.env.DASHBOARD_URL}/settings and goto your account settings to connect your account.`,
            ephemeral: true
        });

        if (interaction.member instanceof GuildMember) {
            await interaction.member.roles.add(constants.ClientRole);

            await interaction.reply({
                content: `You have been granted the role <@&${constants.ClientRole}>.`,
                ephemeral: true
            });
        }
    }

    @Slash({ description: "Send the embed for adding the 'Client' role.", defaultMemberPermissions: ["Administrator"] })
    async client_role_embed(interaction: CommandInteraction, client: StarlitClient) {
        const embed = new EmbedBuilder()
            .setTitle("<:starlit:1142841940220596305> Grant Client Role")
            .setDescription(`Click the button below to claim the <@&${constants.ClientRole}> role.\nGet access via linking your discord account on your starlit account settings page.`)
            .setColor(constants.EmbedColor);

        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("grant_client_role")
                    .setEmoji("<:starlit:1142841940220596305>")
                    .setLabel("Claim Role")
                    .setStyle(ButtonStyle.Secondary)
            )

        await interaction.channel!.send({
            embeds: [embed],
            components: [row]
        });

        await interaction.reply({
            content: "Done.",
            ephemeral: true
        })
    }

}