#!/usr/bin/env node

import { resolve } from 'node:path';
import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { getConfigPaths } from '../lib/getConfigPaths.js';
import { getTemplatesPaths } from '../lib/templates/getTemplatesPaths.js';

const program = new Command();

program.description('Outputs the list of templates').action(() => {
    const { templatesPath, configPath } = getConfigPaths(resolve(process.cwd()));
    const templates = getTemplatesPaths(templatesPath);
    const config = JSON.parse(readFileSync(configPath, { encoding: 'utf8' }));

    const aliases = Object.entries(config.aliases || {}).reduce((acc, [key, value]) => {
        acc[value] = key;

        return acc;
    }, {});

    const print = JSON.stringify(templates, null, 4)
        .replace(/"([^"]+)": {/g, (_, match) => {
            const alias = aliases[match];

            if (alias) {
                return `\x1b[90m${match}\x1b[0m -> \x1b[32m${alias}\x1b[0m: {`;
            } else {
                return `\x1b[32m"${match}"\x1b[0m: {`;
            }
        })
        .replace(/"/g, '');

    process.stdout.write(print + '\n');
});

program.parse(process.argv);
