import { SapphireClient } from "@sapphire/framework";
import type { ThreadChannel } from "discord.js";
import { GatewayIntentBits, Partials } from "discord.js";
import { Connectors, Shoukaku } from "shoukaku";
import { config } from "../config";
import { setShoukakuManager } from "../lib/musicQueue";

function createBotApp() {
    const client = new SapphireClient({
        // intents: [
        //     "GUILDS",
        //     "GUILD_MESSAGES",
        //     "DIRECT_MESSAGES",
        //     "DIRECT_MESSAGE_TYPING",
        //     "GUILD_VOICE_STATES",
        // ],
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.GuildVoiceStates,
        ],
        partials: [Partials.User, Partials.Channel],
        regexPrefix: config.botPrefix,
    });
    const nodes = [
        {
            name: "local",
            url: "kureya.howlingmoon.dev:14045",
            auth: process.env["KUREYA_LAVALINK_PASSWORD"]!,
        },
    ];
    if (config.music) {
        const manager = new Shoukaku(new Connectors.DiscordJS(client), nodes);
        setShoukakuManager(manager);
        // await manager.connect();
        manager.on("error", (_, err) => {
            console.error(`Shoukaku error.`);
            console.error(err);
        });
    }
    client.login(process.env["DISCORD_BOT_TOKEN"]);
    setTimeout(() => {
        const guild = client.guilds.cache.get("688349293970849812");
        if (guild) {
            const chan = guild.channels.cache.get("1009656928852516914");
            if (chan) {
                (chan as ThreadChannel).send(
                    "Mrr.... oharo----gonyaimas.... （＞人＜；）"
                );
            }
        }
    }, 5000);
    return client;
}

export default createBotApp;
