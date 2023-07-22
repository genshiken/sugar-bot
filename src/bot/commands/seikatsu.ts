import { Command } from "@sapphire/framework";
import {
    Message,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
} from "discord.js";
import prisma from "../../lib/prisma";
import { printTimeSection, timeSection } from "../../lib/seikatsu/Schedule";
import type { SugarStats, UserStateMachine } from "../../lib/seikatsu/Engine";
import { events } from "../../lib/seikatsu/Events";
import { timeoutSet } from "../../lib/timeout";

export class SeikatsuCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: "seikatsu",
            // aliases: [],
            description: "Sugar no Seikatsu --Nyanko Days--",
        });
    }

    public override async messageRun(message: Message) {
        // const user = await prisma.users.findFirst({
        //     where: {
        //         uid: message.author.id,
        //     },
        // });
        // prepare variables
        const localTime = new Date(); // somehow already in local time
        const section = timeSection(localTime);
        // display valid actions
        // create discord embed

        // check if user has stats defined
        let userstats = await prisma.userstate.findFirst({
            where: {
                uid: message.author.id,
            },
        });
        if (!userstats) {
            // initialize
            const init: SugarStats = {
                physical: 50,
                affection: 50,
                fatigue: 0,
                boredom: 0,
            };

            const userState: UserStateMachine = {
                id: message.author.id,
                name: message.author.username,
                stats: init,
                actionPoint: 50,
            };

            // save state
            const tempState = {
                uid: message.author.id,
                actionPoint: userState.actionPoint,
                ...userState.stats,
            };
            userstats = await prisma.userstate.create({
                data: tempState,
            });
        }
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
            value: userstats.physical.toString(),
            inline: true,
        });
        embed.addFields({
            name: "Affection",
            value: userstats.affection.toString(),
            inline: true,
        });
        embed.addFields({
            name: "Fatigue",
            value: userstats.fatigue.toString(),
            inline: true,
        });
        embed.addFields({
            name: "Boredom",
            value: userstats.boredom.toString(),
            inline: true,
        });
        embed.addFields({
            name: "Action Points",
            value: userstats.actionPoint.toString(),
            inline: true,
        });

        // List valid actions
        const actions = events[section];
        const actionRow = new ActionRowBuilder<ButtonBuilder>();
        actions
            .filter((x) => x.actionPoint <= userstats!.actionPoint)
            .forEach(async (action) => {
                actionRow.addComponents(
                    new ButtonBuilder()
                        .setLabel(`${action.name} - ${action.actionPoint}`)
                        .setCustomId(
                            `seikatsu#${section}#${action.name}#${message.author.id}`
                        )
                        .setStyle(1)
                );
            });

        embed.setFooter({ text: "Actions [WIP]" });
        let sentMessage: Message<false> | Message<true>;
        if (actionRow.components.length === 0) {
            sentMessage = await message.channel.send({
                embeds: [embed],
            });
        } else {
            sentMessage = await message.channel.send({
                embeds: [embed],
                components: [actionRow],
            });
        }
        if (!timeoutSet.has(sentMessage.id)) {
            timeoutSet.add(sentMessage.id);
            setTimeout(() => {
                sentMessage.delete();
                timeoutSet.delete(sentMessage.id);
            }, 60000);
        }
        await message.delete();
    }
}
