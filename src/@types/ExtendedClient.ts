// src/types/ExtendedClient.ts
import {
    Client,
    Collection,
    ClientOptions,
    ApplicationCommandData,
    PermissionResolvable,
    ApplicationCommandOptionData
} from 'discord.js';

export interface Command {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];
    defaultPermission?: boolean;
    permissions?: PermissionResolvable[];
    roleIds?: string[];
    timeout?: number;
    useDatabase?: boolean;
    execute: (...args: any[]) => void;
    toJSON(): ApplicationCommandData;
}

export interface Event {
    name: string;
    useDatabase?: boolean;
    execute: (...args: any[]) => void;
}

export interface IExtendedClient {
    commands: Collection<string, Command>;
    timeouts: Map<string, number>;
}

export class ExtendedClient extends Client implements IExtendedClient {
    commands: Collection<string, Command>;
    timeouts: Map<string, number>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
        this.timeouts = new Map();
    }
}