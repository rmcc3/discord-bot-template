// src/commands/ping.ts
import { Command } from '../@types/ExtendedClient.js';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';

const ping: Command = {
    name: 'ping',
    description: 'Responds with Pong!',
    timeout: 5,
    defaultPermission: false,
    permissions: [PermissionFlagsBits.Administrator],
    execute: (interaction: CommandInteraction) => {
        interaction.reply('Pong!');
    },
    toJSON() {
        return {
            name: this.name,
            description: this.description,
            defaultPermission: this.defaultPermission,
        };
    },
};

export default ping;