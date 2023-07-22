import {
    InteractionHandler,
    InteractionHandlerTypes,
    PieceContext,
} from "@sapphire/framework";
import {
    EmbedBuilder,
    type ButtonInteraction,
    ActionRowBuilder,
    ButtonBuilder,
} from "discord.js";
import prisma from "../../lib/prisma";
import { events } from "../../lib/seikatsu/Events";
import { TimeSection, printTimeSection } from "../../lib/seikatsu/Schedule";
import {
    stateMachineDataFromUserState,
    transitionState,
} from "../../lib/seikatsu/Engine";
import { timeoutSet } from "../../lib/timeout";

export class SeikatsuInteractionHandler extends InteractionHandler {
    public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button,
        });
    }

    public override async parse(interaction: ButtonInteraction) {
        if (interaction.customId.startsWith("seikatsu")) {
            const [interactionType, timeSection, actionName, author] =
                interaction.customId.split("#");
            console.log(
                `Received interaction from ${interaction.user.id} for interaction with author ${author}`
            );

            return this.some({
                id: interaction.customId,
                section: timeSection!,
                action: actionName!,
                author: author!,
                type: interactionType!,
            });
        } else {
            return this.none();
        }
    }

    public override async run(
        interaction: ButtonInteraction,
        parsedData: InteractionHandler.ParseResult<this>
    ) {
        // console.log(parsedData);
        if (!parsedData) {
            console.log("unimplemented interaction");
            await interaction.reply({
                content: "Unimplemented interaction. Please wait soon or later",
                ephemeral: true,
            });
            return;
        }
        if (interaction.user.id !== parsedData.author) {
            console.log("non-authorized interaction");
            await interaction.reply({
                content: "This message isn't for you",
                ephemeral: true,
            });
            return;
        }

        // get user state
        const userstate = await prisma.userstate.findFirst({
            where: {
                uid: interaction.user.id,
            },
        });
        if (!userstate) {
            console.log("inconsistent state");
            await interaction.reply({
                content: "Inconsistent state. Aborting...",
                ephemeral: true,
            });
            return;
        }
        // get action
        let localTime = new Date();
        let section: TimeSection;
        if (parsedData.section === "morning") section = TimeSection.MORNING;
        else if (parsedData.section === "noon") section = TimeSection.NOON;
        else if (parsedData.section === "night") section = TimeSection.NIGHT;
        else section = TimeSection.SLEEP;
        const action = events[section].find(
            (x) => x.name === parsedData.action
        );
        if (!action) {
            await interaction.reply({
                content: "Invalid state. Aborting...",
                ephemeral: true,
            });
            return;
        }
        // transition state
        let seikatsuState = stateMachineDataFromUserState(userstate);
        seikatsuState = transitionState(action, localTime, seikatsuState);
        // persist to db
        const tempState = {
            uid: interaction.user.id,
            actionPoint: seikatsuState.actionPoint,
            ...seikatsuState.stats,
        };
        await prisma.userstate.updateMany({
            where: { uid: tempState.uid },
            data: tempState,
        });
        // give return message and delete previous message
        const embed = new EmbedBuilder();
        embed.setTitle("Sugar no Seikatsu -- ~~BETA~~ OMEGA");
        embed.addFields({
            name: "Phase of Day (Waktu Internal Sugar)",
            value: printTimeSection(section),
        });
        embed.addFields({
            name: "Time (Waktu Internal Sugar)",
            value: `${localTime.getHours()}:${localTime.getMinutes()}`,
        });
        // post initialization
        embed.addFields({
            name: "Physical",
            value: seikatsuState.stats.physical.toString(),
            inline: true,
        });
        embed.addFields({
            name: "Affection",
            value: seikatsuState.stats.affection.toString(),
            inline: true,
        });
        embed.addFields({
            name: "Fatigue",
            value: seikatsuState.stats.fatigue.toString(),
            inline: true,
        });
        embed.addFields({
            name: "Boredom",
            value: seikatsuState.stats.boredom.toString(),
            inline: true,
        });
        embed.addFields({
            name: "Action Points",
            value: seikatsuState.actionPoint.toString(),
            inline: true,
        });

        // List valid actions
        const actions = events[section];
        const actionRow = new ActionRowBuilder<ButtonBuilder>();
        actions
            .filter((x) => x.actionPoint <= seikatsuState!.actionPoint)
            .forEach(async (action) => {
                actionRow.addComponents(
                    new ButtonBuilder()
                        .setLabel(`${action.name} - ${action.actionPoint}`)
                        .setCustomId(
                            `seikatsu#${section}#${action.name}#${interaction.user.id}`
                        )
                        .setStyle(1)
                );
            });

        embed.setFooter({
            text: "The following action(s) will disappear after a while. Re-invoke for further interaction",
        });
        if (actionRow.components.length === 0) {
            await interaction.message.edit({
                embeds: [embed],
                components: [],
            });
        } else {
            interaction.message.edit({
                embeds: [embed],
                components: [actionRow],
            });
        }
        if (!timeoutSet.has(interaction.message.id)) {
            timeoutSet.add(interaction.message.id);
            setTimeout(() => {
                interaction.message.delete();
                timeoutSet.delete(interaction.message.id);
            }, 60000);
        }
        await interaction.reply({
            content: `You choosed ${action.name}!`,
            ephemeral: true,
        });
    }
}
