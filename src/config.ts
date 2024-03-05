// src/config.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
    token: process.env.DISCORD_BOT_TOKEN || '',
    mongo_uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/discord-bot',
    crash_handler: {
        max_restarts: parseInt(process.env.MAX_RESTARTS || '5'), // Within a 1-minute timeframe
    }
};