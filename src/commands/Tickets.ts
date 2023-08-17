import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, CommandInteraction, EmbedBuilder, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";
import { ButtonComponent, Discord, SelectMenuComponent, Slash } from "discordx";
import { StarlitClient } from "../structures/StarlitClient.js";
import { getAndIncrement } from "../utils/AutoIncrement.js";
import { Ticket } from "../models/Ticket.js";
import { createTranscript } from "discord-html-transcripts";

@Discord()
export class Tickets {

    private ticketCategories = [
        {
            id: "support",
            name: "General Support",
            description: "For general enquiries / presale questions.",
            emoji: "📩",
            supportRoles: ["1141072276385702001"]
        },
        {
            id: "game",
            name: "Game Servers Support",
            description: "For support with any of our game server services.",
            emoji: "🎮",
            supportRoles: ["1141072276385702001"]
        },
        {
            id: "vps",
            name: "VPS Support",
            description: "For support with any of our vps / kvm services.",
            emoji: "💿",
            supportRoles: ["1141072276385702001"]
        },
        {
            id: "billing",
            name: "Billing Support",
            description: "For support with any billing / payment related issues.",
            emoji: "💰",
            supportRoles: ["1141062359012622368"]
        }
    ]

    @Slash({ description: "Check the bots ping", defaultMemberPermissions: ["Administrator"] })
    async ticket_embed(interaction: CommandInteraction, client: StarlitClient) {
        const embed = new EmbedBuilder()
            .setTitle("📩 Support Ticket")
            .setDescription("To create a ticket choose a category from the list below that best suits your issue!")
            .setColor("#facc15");

        const select = new StringSelectMenuBuilder()
            .setCustomId("create_ticket")
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder("Select ticket category")
            .addOptions(
                this.ticketCategories.map((category) => new StringSelectMenuOptionBuilder()
                    .setValue(category.id)
                    .setLabel(category.name)
                    .setEmoji(category.emoji)
                    .setDescription(category.description)
                )
            )

        const row = new ActionRowBuilder()
            .addComponents(select)

        //@ts-ignore
        await interaction.channel?.send({ embeds: [embed], components: [row] })

        interaction.reply({ ephemeral: true, content: "Sent!" })
    }

    @SelectMenuComponent({ id: "create_ticket" })
    async handleSelectMenu(interaction: StringSelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const categoryValue = interaction.values[0];

        const category = this.ticketCategories.find((_category) => _category.id == categoryValue)

        if (!categoryValue || !category) {
            return interaction.followUp("Category is invalid! Please select a category.")
        }

        if (!interaction.guild) return;

        const ticketId = (await getAndIncrement()).toString().padStart(4, "0");

        const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${ticketId}`,
            parent: "1141764010077868073",
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                },
                ...category.supportRoles.map((role) => ({
                    id: role,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                }))
            ]
        })

        await Ticket.create({ 
            category: category.id,
            channelId: ticketChannel.id,
            creator: interaction.user.id,
            ticketId: ticketId
        })

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("close_ticket")
                    .setEmoji("🔒")
                    .setLabel("Close Ticket")
                    .setStyle(ButtonStyle.Danger)
            )

        const ticketEmbed = new EmbedBuilder()
            .setTitle(`Ticket - ${ticketId}`)
            .setDescription(`Hello ${interaction.user}! Thank you for contacting us, please give further information about your issue / enquiry in this channel.\n\n**Category:** \`${category.emoji} ${category.name}\``)
            .setColor("#facc15")

        // @ts-ignore
        await ticketChannel.send({ content: `${interaction.user}`, embeds: [ticketEmbed], components: [row] });

        await interaction.followUp({ ephemeral: true, content: `Succesfully created ticket ${ticketChannel}!` })
    }

    @ButtonComponent({ id: "close_ticket" })
    async handleCloseButton(interaction: ButtonInteraction) {
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🔒 Close Ticket")
            .setDescription("Are you sure you want to close this ticket?");

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("close_ticket_confirm")
                    .setEmoji("🔒")
                    .setLabel("Confirm")
                    .setStyle(ButtonStyle.Danger)
            )

        //@ts-ignore
        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }

    @ButtonComponent({ id: "close_ticket_confirm" })
    async handleCloseConfirmButton(interaction: ButtonInteraction) {
        interaction.deferUpdate();
        if (!interaction.channel?.isTextBased()) return;

        const ticket = await Ticket.findOne({ channelId: interaction.channel.id });

        if (!ticket) return interaction.reply({ ephemeral: true, content: "Could not find ticket entry in DB!" })

        const category = this.ticketCategories.find(_category => _category.id == ticket.category);

        const transcript = await createTranscript(interaction.channel, {
            
            fileName: `ticket-${ticket.ticketId}-${Date.now()}.html`,
            // @ts-ignore
            returnType: "attachment",
            poweredBy: false,
            footerText: ""
        })

        const embed = new EmbedBuilder()
            .setColor("#facc15")
            .setTitle("🔒 Ticket Log")
            .setDescription(`**Category:** \`${category?.emoji} ${category?.name}\`\n**Created By:** <@${ticket.creator}>\n**Created At:** \`${ticket.createdAt.toLocaleString()}\``);

        const ticketLogChannel = await interaction.client.channels.fetch("1141822596648816680");

        if (ticketLogChannel?.isTextBased()) await ticketLogChannel.send({ embeds: [embed], files: [transcript] })
        interaction.user.send({ embeds: [embed], files: [transcript] }).catch(() => { })

        await interaction.channel.delete()
    }
}