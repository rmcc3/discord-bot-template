// extensions/mathExtension/commands/madd.ts
import { Command } from '../../../src/@types/ExtendedClient.js';
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';

const madd: Command = {
    name: 'madd',
    description: 'Performs addition math.',
    options: [
        {
            name: 'num1',
            description: 'The first number.',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'num2',
            description: 'The second number.',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],
    useDatabase: false,
    execute: (interaction: CommandInteraction) => {
        const num1 = interaction.options.get('num1')?.value as number;
        const num2 = interaction.options.get('num2')?.value as number;

        if (num1 === undefined || num2 === undefined) {
            interaction.reply('Please provide both numbers.');
            return;
        }

        const result = num1 + num2;

        interaction.reply(`The result of ${num1} + ${num2} is ${result}.`);
    },
    toJSON() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
        };
    },
};

export default madd;