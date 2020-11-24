import { Client } from "discord.js";
import path from 'path';

require('dotenv').config({ path: path.join(process.cwd(), ".env") });

new Client().login(process.env.BOT_TOKEN || '');