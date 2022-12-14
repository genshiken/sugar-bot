import type { VoiceBasedChannel } from "discord.js";
import type { Player, Shoukaku, Track } from "shoukaku";

export interface MusicGuildInfo {
    initiator: string;
    voiceChannel: VoiceBasedChannel;
    currentPosition: number;
    queue: Track[];
    isRepeat: "no" | "single" | "playlist";
    isPausing: boolean;
    isPlaying: boolean;
    player: Player;
    isSkippingQueued: boolean;
    skipPosition: number;
}

const manager = new Map<string, MusicGuildInfo>();
export let shoukakuManager: Shoukaku | undefined = undefined;

export function getShoukakuManager() {
    return shoukakuManager;
}

export function setShoukakuManager(manager: Shoukaku) {
    shoukakuManager = manager;
}

export default manager;
