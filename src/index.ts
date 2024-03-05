// src/index.ts
import {Collection, IntentsBitField, REST, Routes, Snowflake} from 'discord.js';
import { config } from './config.js';
import connectToDatabase from './database.js';
import { loadExtensions } from './extensionLoader.js';
import { ExtendedClient } from './@types/ExtendedClient.js';

const botIntents = new IntentsBitField();

// Default bot intents
botIntents.add(
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildModeration
);

let restartCount = 0;
const maxRestarts = config.crash_handler.max_restarts;
const restartTimeframe = 60000; // 1 minute in milliseconds

const client = new ExtendedClient({
    intents: [
        botIntents
    ],
});

client.commands = new Collection();

async function startBot() {
    try {
        await connectToDatabase();

        const rest = new REST({ version: '10' }).setToken(config.token);

        client.on('ready', async () => {
            console.log(`Logged in as ${client.user?.tag}`);
            console.log('Started refreshing application (/) commands.');

            await loadExtensions(client);

            const commandsJSON = client.commands.map(command => command.toJSON());
            await rest.put(Routes.applicationCommands(client.user?.id as Snowflake), { body: commandsJSON });

            console.log('Successfully reloaded application (/) commands.');
        });

        await client.login(config.token);
    } catch (error) {
        console.error('Bot startup failed:', error);
        handleCrash();
    }
}

function handleCrash() {
    restartCount++;

    if (restartCount <= maxRestarts) {
        console.log(`Restarting bot (Attempt ${restartCount}/${maxRestarts})...`);
        setTimeout(startBot, 5000); // Restart after a 5-second delay
    } else {
        console.error('Too many restarts. Stopping the bot.');
        process.exit(1);
    }
}

// Reset the restart count after the specified timeframe
setInterval(() => {
    restartCount = 0;
}, restartTimeframe);

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    handleCrash();
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    handleCrash();
});

startBot();