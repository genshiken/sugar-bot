import { Command } from "@sapphire/framework";
import { Formatters, Message } from "discord.js";
import prisma from "../../lib/prisma";

export class DrinkCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: "drink",
            aliases: ["drink", "minum", "nonde"],
            description: "Drink Kratingd*eng if available",
        });
    }

    public override async messageRun(message: Message) {
        const user = await prisma.users.findFirst({
            where: {
                uid: message.author.id,
            },
        });
        if (!user) {
            await message.channel.send(
                "Ew, I don't know who you are but you're creepy\n気持ちわるい"
            );
            return;
        }
        // check if has kratingdaeng
        if (user.powerup.includes("kratingdaeng")) {
            // remove one kratingdaeng
            const tempPowerup = [...user.powerup];
            tempPowerup.pop();
            await prisma.users.updateMany({
                where: {
                    uid: message.author.id,
                },
                data: {
                    powerup: tempPowerup,
                    active_powerup: "kratingdaeng",
                },
            });
            await message.reply(
                `MMMHHHH!!!! I FEEL LIKE I CAN LAST FOR THE ENTIRE NIGHT LONG. COME ON ${Formatters.userMention(
                    message.author.id
                )}, I WONT LET YOU SLEEP TONIGHT`
            );
            return;
        }

        await message.reply(
            `I'm not quite sure what you want me to drink. Give me something to drink I guess?`
        );
        return;
    }
}
