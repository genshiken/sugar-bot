import { Args, Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import musicManager from "../../../lib/musicQueue";

export class RemoveFromQueueCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: "remove",
            aliases: ["delete"],
            description: "Remove a certain track from music queue",
        });
    }

    public async messageRun(message: Message, args: Args) {
        if (!message.guildId) {
            await message.channel.send("This command only works in servers");
            return;
        }
        if (!message.member?.voice.channel) {
            await message.channel.send("You must be in voice channel first.");
            return;
        }
        const musicGuildInfo = musicManager.get(message.guildId!);
        if (!musicGuildInfo) {
            await message.channel.send("No bot in voice channel. Are you okay?");
            return;
        }
        try {
            const posToRemove = await args.pick("integer");
            // check if there is a current playing track
            if (posToRemove < 1 || posToRemove > musicGuildInfo.queue.length) {
                await message.channel.send("Out of range track number.");
                return;
            }
            if (musicGuildInfo.isPlaying && musicGuildInfo.currentPosition === posToRemove - 1) {
                await message.channel.send("Cannot remove currently playing track.");
                return;
            }
            const deletedTracks = musicGuildInfo.queue.splice(posToRemove - 1, 1);
            await message.channel.send(`Removed track **${deletedTracks[0]?.info.title}** from the queue.`);
            return;
        } catch (error) {
            await message.channel.send("Error on command. Please put non-zero positive integer");
            return;
        }
    }
}
