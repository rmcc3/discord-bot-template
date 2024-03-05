// src/alias.ts
import * as path from 'path';

const baseDir = path.resolve(__dirname, '..');

function createAliases(dir: string): Record<string, string> {
    return {
        '@types': path.resolve(dir, 'types'),
        '@utils': path.resolve(dir, 'utils'),
        '@database': path.resolve(dir, 'database.ts'),
    };
}

module.exports = createAliases(baseDir);