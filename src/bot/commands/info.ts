import { Command } from "@sapphire/framework";
import { Message, EmbedBuilder } from "discord.js";
import prisma from "../../lib/prisma";

export class InfoCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: "info",
            aliases: ["ingfo"],
            description: "Prints user info",
        });
    }

    public override async messageRun(message: Message) {
        const user = await prisma.users.findFirst({
            where: {
                uid: message.author.id,
            },
        });
        const infoEmbedBuilder = new EmbedBuilder();
        infoEmbedBuilder.setTitle("User Info");
        infoEmbedBuilder.addFields({
            name: `Common Info`,
            value: `Name: **${message.author.username}**\nUserId: ${
                message.author.id
            }\nNickname: ${
                (await message.guild!.members.fetch(message.author.id))
                    .displayName
            }`,
        });
        if (!user) {
            infoEmbedBuilder.addFields({
                name: "Relation with Sugar",
                value: `Sugar: "who are you?"`,
            });
        } else {
            const totalUserScore = await prisma.feedrecord.aggregate({
                _sum: {
                    amount: true,
                },
                where: {
                    uid: message.author.id,
                },
            });
            const totalScore = await prisma.feedrecord.aggregate({
                _sum: {
                    amount: true,
                },
            });
            infoEmbedBuilder.addFields({
                name: `Relation with Sugar`,
                value: `Sugar: "Hey, I recognize this guy, nyaa!\nHis/her user point is ${totalUserScore
                    ._sum.amount!}\nKeep feeding me, nyaa!"`,
            });
            infoEmbedBuilder.addFields({
                name: `Kratingd*eng in posession`,
                value: `${user.powerup.length}`,
            });
            if (message.author.id === "145558597424644097") {
                infoEmbedBuilder.setTimestamp().setFooter({
                    text: `Btw, total score is  ${totalScore._sum.amount!}`,
                });
            }
        }
        await message.channel.send({ embeds: [infoEmbedBuilder] });
    }
}
