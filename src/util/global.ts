let config;
try {
    config = require("../config.json");
} catch {
    config = process.env;
}

export default {
    BOT_TOKEN: config.BOT_TOKEN,
    MYSQL_USER: config.MYSQL_USER,
    MYSQL_PASS: config.MYSQL_PASS,
    MYSQL_DB_NAME: config.MYSQL_DB_NAME,
};
