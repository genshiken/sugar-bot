import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import musicManager, { getShoukakuManager } from "../../../lib/musicQueue";
import logger from "../../../lib/winston";
// import prisma from "../../lib/prisma";

export class StopMusicCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: "stop",
            description: "Stop playing music",
            detailedDescription: `Stop playing music AND leaves the voice channel.
            This command will make the bot leave the voice channel and destroy the current playlist.`,
        });
    }

    public override async messageRun(message: Message) {
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
        await musicGuildInfo.player.stopTrack();
        const shoukakuManager = getShoukakuManager();
        if (!shoukakuManager) {
            await message.channel.send("Music manager uninitizalied. Check your implementation, dumbass");
            return;
        }
        shoukakuManager.leaveVoiceChannel(message.guildId);
        await message.channel.send("Leaving the voice channel");
        musicManager.delete(message.guildId!);
    }
}
