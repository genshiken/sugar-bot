export const config = {
    host: "0.0.0.0",
    port: 8000,
    isDev: process.env["NODE_ENV"] === "development",
    botPrefix:
        process.env["NODE_ENV"] === "development"
            ? new RegExp("^sdev[,! ]", "i")
            : new RegExp("^sugar[,! ]", "i"),
    music: process.env["MUSIC"] === "false" ? false : true, // by default will enable music feature
};

if (process.env["NODE_ENV"] === "development") {
    config.host = "127.0.0.1";
}
