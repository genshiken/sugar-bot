import { Args, Command } from "@sapphire/framework";
import { Message } from "discord.js";
import prisma from "../../lib/prisma";
import { POWERUP_KRATINGDAENG } from "../../lib/gacha";
import { config } from "../../config";

export class TopUpCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            name: "topup",
            description: "Top up 10 Kratingd*eng",
        });
    }

    public override async messageRun(message: Message, args: Args) {
        if (!config.isDev) {
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
        // add 10 kratingdaeng to current user powerup
        const remainingPowerup = user.powerup;
        remainingPowerup.push(...Array(10).fill(POWERUP_KRATINGDAENG));
        await prisma.users.updateMany({
            where: {
                uid: message.author.id,
            },
            data: {
                powerup: remainingPowerup,
            },
        });
        await message.reply("You've successfully topped up 10 Kratingd*eng!");
    }
}
