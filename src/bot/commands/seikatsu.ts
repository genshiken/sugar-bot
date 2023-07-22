import { Command } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import prisma from "../../lib/prisma";
import { printTimeSection, timeSection } from "../../lib/seikatsu/Schedule";
import type { SugarStats, UserStateMachine } from "../../lib/seikatsu/Engine";

export class SeikatsuCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: "seikatsu",
            // aliases: [],
            description: "Sugar no Seikatsu --Nyanko Days--",
        });
    }

    public async messageRun(message: Message) {
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
        const embed = new MessageEmbed();
        embed.setTitle("Sugar no Seikatsu -- ~~BETA~~ OMEGA");
        embed.addField(
            "Phase of Day (Waktu Internal Sugar)",
            printTimeSection(section)
        );
        embed.addField(
            "Time (Waktu Internal Sugar)",
            `${localTime.getHours()}:${localTime.getMinutes()}`
        );

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
        // post initialization
        embed.addField("Physical", userstats.physical.toString(), true);
        embed.addField("Affection", userstats.affection.toString(), true);
        embed.addField("Fatigue", userstats.fatigue.toString(), true);
        embed.addField("Boredom", userstats.boredom.toString(), true);

        embed.setFooter({ text: "Actions [WIP]" });
        await message.channel.send({
            embeds: [embed],
        });
        /* if (!sentMessage) return
        // List valid actions
        const actions = events[section];
        let i = 1
        actions.forEach(async (action) => {
        `2⃣`
            // actionRow.addComponents(
            //     new MessageButton()
            //         .setLabel(`${action.name} - ${action.actionPoint}`)
            //         .setCustomId(`seikatsu#${section}#${action.name}`)
            //         .setStyle(1)
            // );
        }); */
    }
}
