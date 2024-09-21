import { Args, Command } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import prisma from "../../lib/prisma";
import { GachaFactory, GachaPool, POWERUP_KRATINGDAENG, RateUpGachaRate } from "../../lib/gacha";
import { config } from "../../config";

export class GachaCommand extends Command {
    private gachaFactory: GachaFactory;
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            name: "gacha",
            description: "Rolls gacha",
            flags: ["i"],
        });
        this.gachaFactory = new GachaFactory();
    }

    public override async messageRun(message: Message, args: Args) {
        let amount = await args.pick("number").catch(() => 1);
        amount = Math.max(1, Math.min(amount, 10));
        const isRequestingInfo = args.getFlags("i");

        if (isRequestingInfo) {
            const embed = new EmbedBuilder();
            const fields: any[] = [];
            fields.push({
                name: "Drop Rate",
                value: Object.entries(RateUpGachaRate)
                    .map((x) => {
                        if (x[0] === "normal") {
                            return `${x[0]} - ${(x[1] - RateUpGachaRate.rare) * 100}%`;
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
            embed.setTitle("Rate Up Gacha Info");
            embed.setFields(fields);
            await message.channel.send({ embeds: [embed] });
            return;
        }

        const user = await prisma.users.findFirst({
            where: {
                uid: message.author.id,
            },
        });
        if (!user) {
            await message.channel.send("Ew, I don't know who you are but you're creepy\n気持ちわるい");
            return;
        }
        const totalKratingdaeng = this.getTotalKratingdaeng(user.powerup);
        if (totalKratingdaeng < amount) {
            await message.reply("You don't have enough Kratingd*eng to roll gacha for that amount\nYour total Kratingd*eng: " + totalKratingdaeng);
            return;
        }
        const retrievedItems = [];
        for (let i = 0; i < amount; i++) {
            retrievedItems.push(this.gachaFactory.rateupGacha());
        }
        const droppedKratingdaeng = retrievedItems.filter((item) => item.name === "Kratingd**ng").length;
        const remainingPowerup = this.removeKratingdaeng(user.powerup, amount);
        if (droppedKratingdaeng > 0) {
            remainingPowerup.push(...Array(droppedKratingdaeng).fill(POWERUP_KRATINGDAENG));
        }
        const now = new Date();
        await prisma.feedrecord.createMany({
            data: retrievedItems.map((item) => ({
                uid: message.author.id,
                amount: item.weight,
                name: item.name,
                rarity: item.rarity,
                date: now,
            })),
        });
        await prisma.users.updateMany({
            where: {
                uid: message.author.id,
            },
            data: {
                powerup: remainingPowerup,
            },
        });
        const embed = new EmbedBuilder();
        embed.setTitle("Gacha Results");
        let msg = "";
        for (const item of retrievedItems) {
            msg += `${item.rarity} - \`${item.name}\`\n`;
        }
        embed.setDescription(msg);
        await message.channel.send({ embeds: [embed] });
        let isMisc = false;
        let isLegendary = false;
        let isUltraRare = false;

        for (const item of retrievedItems) {
            if (item.rarity === "legendary rare") {
                isLegendary = true;
            } else if (item.rarity === "ultra rare") {
                isUltraRare = true;
            } else if (item.rarity === "misc") {
                isMisc = true;
            }
        }
        if (isMisc) {
            const miscItem = retrievedItems.find((item) => item.rarity === "misc")!;
            const nickname = (await message.guild!.members.fetch(message.author.id)).displayName;
            let response = miscItem.message;
            response = response?.replaceAll("{{NICKNAME}}", nickname);
            await message.channel.send(`${config.isDev ? "[DEVELOPMENT]\n" : ""}You've fed me\n${miscItem.name}!\n\n${response}`);
            await message.reply("You got mythical item(s) as it seems. Does it worth the Kratingd*eng?");
            return;
        } else if (isLegendary) {
            const item = retrievedItems.find((item) => item.rarity === "legendary rare")!;
            const nickname = (await message.guild!.members.fetch(message.author.id)).displayName;
            let response = item.message;
            response = response?.replaceAll("{{NICKNAME}}", nickname);
            await message.channel.send(`${config.isDev ? "[DEVELOPMENT]\n" : ""}You've fed me\n${item.name}!\n\n${response}`);
            await message.reply("You got legendary item(s)! You're lucky! (or not)");
            return;
        } else if (isUltraRare) {
            const item = retrievedItems.find((item) => item.rarity === "ultra rare")!;
            const nickname = (await message.guild!.members.fetch(message.author.id)).displayName;
            let response = item.message;
            response = response?.replaceAll("{{NICKNAME}}", nickname);
            await message.channel.send(`${config.isDev ? "[DEVELOPMENT]\n" : ""}You've fed me\n${item.name}!\n\n${response}`);
            await message.reply("You got ultra rare item(s)! I wonder how much luck you have left...");
            return;
        } else {
            await message.reply("You got... something......... I guess it's better than nothing, I pity you tho, n-nyaa...\n_what a lame gacha roll_");
        }
        return;
    }

    private removeKratingdaeng(arr: string[], amount: number): string[] {
        let count = 0;
        return arr.filter((item) => {
            if (item === POWERUP_KRATINGDAENG && count < amount) {
                count++;
                return false;
            }
            return true;
        });
    }

    private getTotalKratingdaeng(arr: string[]): number {
        return arr.filter((item) => item === POWERUP_KRATINGDAENG).length;
    }
}
