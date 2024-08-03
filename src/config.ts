import dotenv from "dotenv";
import path from "path";
if (process.env["NODE_ENV"] === "development") {
    console.log("Application is running in development mode");
    dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
} else {
    console.log("Application is running in production mode");
    dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
    console.log(process.env);
}

export function getEnv(name: string) {
    let val = process.env[name];
    if (val === undefined || val === null) {
        throw new Error("Missing environment variable: " + name);
    }
    return val;
}

export const config = {
    host: "0.0.0.0",
    port: 8000,
    isDev: process.env["NODE_ENV"] === "development",
    botPrefix: process.env["NODE_ENV"] === "development" ? new RegExp("^sdev[,! ]", "i") : new RegExp("^sugar[,! ]", "i"),
    music: process.env["MUSIC"] === "false" ? false : true, // by default will enable music feature
    lavalinkConfigPath: process.env["MUSIC"] === "false" ? "" : getEnv("LAVALINK_CONFIG_PATH"),
    grafanaHost: process.env["GRAFANA_HOST"] || null,
};

if (process.env["NODE_ENV"] === "development") {
    config.host = "127.0.0.1";
}
