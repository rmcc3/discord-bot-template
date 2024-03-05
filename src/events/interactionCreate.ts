// src/events/interactionCreate.ts
import { BaseInteraction } from 'discord.js';
import { ExtendedClient } from '../@types/ExtendedClient.js';
import { PermissionManager } from '../utils/permissionManager.js';

export default {
    name: 'interactionCreate',
    execute: async (client: ExtendedClient, interaction: BaseInteraction) => {
        if (!interaction.isCommand()) return;
        if (interaction.replied || interaction.deferred) return;

        const command = client.commands.get(interaction.commandName);

        if (command) {
            const userId = interaction.user.id;
            const timeoutKey = `${userId}_${command.name}`;
            const userTimeout = client.timeouts.get(timeoutKey);
            const currentTime = Date.now();

            if (command.timeout && userTimeout && currentTime < userTimeout) {
                const remainingTime = Math.ceil((userTimeout - currentTime) / 1000);
                interaction.reply({
                    content: `Please wait ${remainingTime} second(s) before using the "${command.name}" command again.`,
                    ephemeral: true,
                });
                return;
            }

            if (PermissionManager.checkPermissions(interaction, command.permissions || [], command.roleIds || [])) {
                command.execute(interaction);
            } else {
                interaction.reply('You do not have permission to use this command.');
            }
        }
    }
};