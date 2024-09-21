import { Args, Command } from "@sapphire/framework";
import { Formatters, Message, EmbedBuilder, Embed } from "discord.js";
import prisma from "../../lib/prisma";
import { sub, formatDistanceToNow } from "date-fns";
import { config } from "../../config";
import { GachaFactory, GachaPool, GachaRate, POWERUP_KRATINGDAENG } from "../../lib/gacha";

export class FeedCommand extends Command {
    private gachaFactory: GachaFactory;
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: "feed",
            aliases: ["makan", "mangan"],
            description: "Feeds Sugar various stuff.\nAlso gacha hell, haha",
            flags: ["history", "h", "l", "i"],
        });
        this.gachaFactory = new GachaFactory();
    }

    public override async messageRun(message: Message, args: Args) {
        const isRequestingHistory = args.getFlags("history", "h");
        const isRequestingLeaderboard = args.getFlags("l");
        const isRequestingInfo = args.getFlags("i");
        if (isRequestingLeaderboard) {
            if (!message.guild) {
                await message.channel.send("Can't do this command outside the server, nyaa");
                return;
            }
            const leaderboard = await prisma.feedrecord.groupBy({
                by: ["uid"],
                _sum: {
                    amount: true,
                },
                orderBy: {
                    _sum: {
                        amount: "desc",
                    },
                },
            });
            const embed = new EmbedBuilder();
            embed.setTitle("Sugar Leaderboard");
            let msg = "";
            let i = 0;
            for (const item of leaderboard.slice(0, 10)) {
                msg += `${i + 1}. ${Formatters.userMention(item.uid)} - ${item._sum.amount}\n`;
                i++;
            }
            if (config.grafanaHost) {
                embed.setDescription(Formatters.hyperlink("Cool Dashboard Here!", `${config.grafanaHost}/public-dashboards/b256248adc5f4990a8f938604b29d4fc`));
            }
            await message.channel.send({ embeds: [embed] });
            return;
        }

        if (isRequestingHistory) {
            if (!message.guild) {
                await message.channel.send("Can't do this command outside the server, nyaa");
                return;
            }
            const feedHistory = await prisma.feedrecord.findMany({
                where: {
                    uid: message.author.id,
                },
                orderBy: {
                    date: "desc",
                },
                take: 10,
            });
            const embed = new EmbedBuilder();
            embed.setTitle(`Feed history for ${(await message.guild.members.fetch(message.author.id)).displayName}`);
            let rekishi = "";
            for (let i = 0; i < feedHistory.length; i++) {
                rekishi += `${i + 1}. ${feedHistory[i].name}\n`;
            }
            embed.setDescription(rekishi);
            await message.channel.send({ embeds: [embed] });
            return;
        }

        if (isRequestingInfo) {
            const embed = new EmbedBuilder();
            const fields: any[] = [];
            fields.push({
                name: "Drop Rate",
                value: Object.entries(GachaRate)
                    .map((x) => {
                        if (x[0] === "normal") {
                            return `${x[0]} - ${(x[1] - GachaRate.rare) * 100}%`;
                        } else {
                            return `${x[0]} - ${x[1] * 100}%`;
                        }
                    })
                    .join("\n"),
            });
            Object.values(GachaPool).forEach((bin) => {
                fields.push({
                    name: `Pool - ${bin.category}`,
                    value: bin.items.map((x) => `\`${x.name}\``).join(" "),
                });
            });
            embed.setTitle("Gacha Info");
            embed.setFields(fields);
            await message.channel.send({ embeds: [embed] });
            return;
        }

        const gacha = this.gachaFactory.gacha();
        let user = await prisma.users.findFirst({
            where: {
                uid: message.author.id,
            },
        });
        if (!user) {
            user = await prisma.users.create({
                data: {
                    uid: message.author.id,
                    name: message.author.username,
                    active_powerup: "",
                    powerup: [],
                },
            });
        }
        const recordOfRecentFeed = await prisma.feedrecord.findFirst({
            where: {
                uid: message.author.id,
                date: {
                    gt: sub(new Date(), { hours: 2 }),
                },
            },
        });
        if (user.active_powerup === POWERUP_KRATINGDAENG) {
            // use kratingdaeng, update active to empty
            await prisma.users.updateMany({
                where: {
                    uid: message.author.id,
                },
                data: {
                    active_powerup: "",
                },
            });
        } else if (recordOfRecentFeed) {
            const deltaTime = formatDistanceToNow(recordOfRecentFeed.date);
            await message.channel.send(`You've feed me ${deltaTime} ago, nyaa. Let me sleep, nyaw...`);
            return;
        }
        const recordOfZonkFeed = await prisma.feedrecord.findFirst({
            where: {
                uid: message.author.id,
                amount: -15,
                date: {
                    gt: sub(new Date(), { hours: 24 }),
                },
            },
        });
        if (recordOfZonkFeed) {
            await message.channel.send(`Didn't I tell you to go away? HISSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS`);
            return;
        }
        await prisma.feedrecord.create({
            data: {
                uid: message.author.id,
                amount: gacha.weight,
                name: gacha.name,
                rarity: gacha.rarity,
                date: new Date(),
            },
        });
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const recordOfTodayFeed = await prisma.feedrecord.findMany({
            where: {
                uid: message.author.id,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });
        if (recordOfTodayFeed.length == 4) {
            await prisma.users.updateMany({
                where: {
                    uid: message.author.id,
                },
                data: {
                    powerup: {
                        push: POWERUP_KRATINGDAENG,
                    },
                },
            });
            await message.channel.send("You've feed me 4 times today, nyaa. Have a kratingdaeng to keep you awake, nyaw...");
        }
        if (gacha.name === "Kratingd**ng") {
            await prisma.users.updateMany({
                where: {
                    uid: message.author.id,
                },
                data: {
                    powerup: {
                        push: POWERUP_KRATINGDAENG,
                    },
                },
            });
        }

        const nickname = (await message.guild!.members.fetch(message.author.id)).displayName;
        let response = gacha.message;
        response = response?.replaceAll("{{NICKNAME}}", nickname);
        await message.channel.send(`${config.isDev ? "[DEVELOPMENT]\n" : ""}You've fed me\n${gacha.name}!\n\n${response}`);
    }
}
