import prisma from "../../lib/prisma";
import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import { sub } from "date-fns";

export class ShouldCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: "should",
            aliases: [
                "shall",
                "ryn",
                "bolehkah",
                "apakah",
                "am",
                "is",
                "are",
                "how",
            ],
            description:
                "Spews out sugar's thoughts about 'should/shall' question. Only limited to those keywords only",
        });
    }

    public async messageRun(message: Message) {
        const userScore = await prisma.feedrecord.aggregate({
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
        const activationFunction = (user: number, total: number) => {
            const ratio = Math.exp(Math.log10(user / total));
            return ratio;
        };
        const positiveAnswers = ["Yes", "Yes!", "YESSS!!!"];
        const ssrAnswer =
            "Of course yes, master. Anything you think the best I also think the best";
        const whiskasRecently = await prisma.feedrecord.findFirst({
            where: {
                amount: 10,
                date: {
                    gt: sub(new Date(), { hours: 3 }),
                },
                uid: message.author.id,
            },
        });
        const af_score = activationFunction(
            userScore._sum.amount!,
            totalScore._sum.amount!
        );
        if (whiskasRecently) {
            if (af_score > 0.5) {
                await message.channel.send(ssrAnswer);
                return;
            }
            const answer =
                positiveAnswers[
                    Math.floor(Math.random() * positiveAnswers.length)
                ]!;
            if (af_score > 0.3 && Math.random() > 0.3) {
                await message.channel.send(answer);
                return;
            }
        }
        if (af_score > 0.1) {
            const ans = ["Yes", "Maybe", "Silahkan coba lagi"];
            await message.channel.send(
                ans[Math.floor(Math.random() * ans.length)]!
            );
            return;
        }

        const answers = [
            "Yes",
            "No",
            "Bayar uang kas dulu.",
            "Silahkan coba lagi.",
        ];
        const answer = answers[Math.floor(Math.random() * answers.length)]!;
        await message.channel.send(answer);
    }
}
