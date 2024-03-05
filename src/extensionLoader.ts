// src/extensionLoader.ts
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { ExtendedClient, Event } from './@types/ExtendedClient.js';
import connectToDatabase from './database.js';
import * as url from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensionsDir = path.join(__dirname, '..', 'extensions');
const internalCommandsDir = path.join(__dirname, 'commands');
const internalEventsDir = path.join(__dirname, 'events');

async function loadCommandModule(filePath: string) {
    const module = await import(url.pathToFileURL(filePath).toString());
    return module.default;
}

async function loadEventModule(filePath: string) {
    const module = await import(url.pathToFileURL(filePath).toString());
    return module.default;
}

export async function loadExtensions(client: ExtendedClient) {
    const db = await connectToDatabase();

    // Load internal commands
    const internalCommandFiles = fs.readdirSync(internalCommandsDir).filter(file => file.endsWith('.js'));
    for (const file of internalCommandFiles) {
        const filePath = path.join(internalCommandsDir, file);
        const command = await loadCommandModule(filePath);
        if (command.useDatabase === true && !db) {
            console.warn(`Skipping internal command ${command.name} because it requires a database connection.`);
            continue;
        }

        if (client.commands.has(command.name)) {
            console.warn(`Skipping internal command ${command.name} because it conflicts with an existing command.`);
            continue;
        }
        client.commands.set(command.name, command);
        console.log(`Loaded internal command: ${command.name}`);
    }

    // Load internal events
    const internalEventFiles = fs.readdirSync(internalEventsDir).filter(file => file.endsWith('.js'));
    for (const file of internalEventFiles) {
        const filePath = path.join(internalEventsDir, file);
        const event: Event = await loadEventModule(filePath);
        if (event.useDatabase === true && !db) {
            console.warn(`Skipping internal event ${event.name} because it requires a database connection.`);
            continue;
        }
        client.on(event.name, (...args: any[]) => event.execute(client, ...args));
        console.log(`Loaded internal event: ${event.name}`);
    }

    // Load extension commands and events
    const extensionFolders = fs.readdirSync(extensionsDir);

    for (const folder of extensionFolders) {
        const extensionPath = path.join(extensionsDir, folder);
        const extensionJson = path.join(extensionPath, 'extension.json');

        if (!fs.existsSync(extensionJson)) {
            console.warn(`Extension ${folder} is missing extension.json file. Skipping.`);
            continue;
        }

        const extension = JSON.parse(fs.readFileSync(extensionJson, 'utf8'));

        try {

            // Load extension commands
            const commandsPath = path.join(extensionPath, 'commands');
            if (fs.existsSync(commandsPath)) {
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);
                    const command = await loadCommandModule(filePath);
                    if (command.useDatabase === true && !db) {
                        console.warn(`Skipping extension command ${command.name} because it requires a database connection.`);
                        continue;
                    }

                    if (client.commands.has(command.name)) {
                        console.warn(`Skipping extension command ${command.name} from ${extension.name} because it conflicts with an existing command.`);
                        continue;
                    }
                    client.commands.set(command.name, command);
                    console.log(`Loaded extension command: ${command.name}`);
                }
            }

            // Load extension events
            const eventsPath = path.join(extensionPath, 'events');
            if (fs.existsSync(eventsPath)) {
                const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
                for (const file of eventFiles) {
                    const filePath = path.join(eventsPath, file);
                    const event: Event = await loadEventModule(filePath);
                    if (event.useDatabase === true && !db) {
                        console.warn(`Skipping extension event ${event.name} because it requires a database connection.`);
                        continue;
                    }
                    client.on(event.name, (...args: any[]) => event.execute(client, ...args));
                    console.log(`Loaded extension event: ${event.name}`);
                }
            }

            console.log(`Loaded extension: ${extension.name}`);
        } catch (error) {
            console.error(`Error loading extension ${extension.name}:`, error);
        }
    }
}