import { SapphireClient } from "@sapphire/framework";
import type { ThreadChannel } from "discord.js";
import { GatewayIntentBits, Partials } from "discord.js";
import { Connectors, Shoukaku } from "shoukaku";
import { config } from "../config";
import { setShoukakuManager } from "../lib/musicQueue";
import fetch from "node-fetch";
import "@sapphire/plugin-hmr/register";
import prisma from "../lib/prisma";
import logger from "../lib/winston";
async function createBotApp() {
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
            GatewayIntentBits.MessageContent,
        ],
        partials: [Partials.User, Partials.Channel],
        regexPrefix: config.botPrefix,
        loadMessageCommandListeners: true,
        hmr: { enabled: true },
    });
    console.log(process.env);
    console.log(config);
    if (config.music && config.lavalinkConfigPath) {
        const nodes = [];
        const lavalinkNodeConfig = await fetch(config.lavalinkConfigPath).then((res) => res.json());
        console.log(lavalinkNodeConfig);
        for (const node of lavalinkNodeConfig) {
            logger.info(`Added ${node.name} to lavalink node pool`);
            nodes.push(node);
        }
        logger.info("Initializing Shoukaku connector");
        const manager = new Shoukaku(new Connectors.DiscordJS(client), nodes, {
            resume: true,
            resumeByLibrary: true,
        });

        setShoukakuManager(manager);
        manager.on("error", (_, err) => {
            logger.error(`Shoukaku error.`);
            logger.error(err);
            console.log(err);
        });
        manager.on("ready", () => {
            logger.info("Shoukaku manager is ready");
        });
    }
    client.login(process.env["DISCORD_BOT_TOKEN"]);
    setTimeout(() => {
        const guild = client.guilds.cache.get("688349293970849812");
        if (guild) {
            const chan = guild.channels.cache.get("1009656928852516914");
            if (chan) {
                (chan as ThreadChannel).send("Mrr.... oharo----gonyaimas.... （＞人＜；）");
            }
        }
    }, 5000);
    // start incrementor
    setInterval(async () => {
        await prisma.userstate.updateMany({
            where: {
                actionPoint: {
                    lt: 50,
                },
            },
            data: {
                actionPoint: {
                    increment: 1,
                },
            },
        });
        // logger.info(`[seikatsu] AP incrementor ran at ${new Date().toLocaleString()}}`);
    }, 30000 * 10);
    setInterval(async () => {
        await new Promise((res) => setTimeout(res, 5000));
        await prisma.userstate.updateMany({
            where: {
                boredom: {
                    gte: 0,
                    lte: 100,
                },
            },
            data: {
                boredom: {
                    increment: 3,
                },
            },
        });
        // logger.info(`[seikatsu] Boredom incrementor ran at ${new Date().toLocaleString()}}`);
    }, 60000 * 10);
    return client;
}

export default createBotApp;
