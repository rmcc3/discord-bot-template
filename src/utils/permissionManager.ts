// src/utils/permissionManager.ts
import { CommandInteraction, GuildMember, PermissionResolvable } from 'discord.js';

export class PermissionManager {
    static hasPermission(member: GuildMember, permissions: PermissionResolvable[]): boolean {
        return permissions.every(permission => member.permissions.has(permission));
    }

    static hasRole(member: GuildMember, roleIds: string[]): boolean {
        return roleIds.some(roleId => member.roles.cache.has(roleId));
    }

    static checkPermissions(interaction: CommandInteraction, permissions: PermissionResolvable[], roleIds: string[]): boolean {
        const member = interaction.member as GuildMember;
        return this.hasPermission(member, permissions) || this.hasRole(member, roleIds);
    }
}