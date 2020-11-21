import path from 'path';
import chalk from "chalk";

require('dotenv').config({ path: path.join(process.cwd(), ".env") });

console.log(chalk`\n{reset.yellow === ${process.env.npm_package_name} v${process.env.npm_package_version} === }`);
console.log(chalk`{dim Starting up ...}`);

import bot from "./bot";
bot.start(process.env.DISCORD_TOKEN || '')
    .then(() => console.log(chalk.greenBright("Discord bot instance is up and running!")));

import * as dashboard from './dashboard';
dashboard.start(parseInt(process.env.DASHBOARD_PORT || '3001'))
    .then(() => console.log(chalk.greenBright('Dashboard is up and running!')));