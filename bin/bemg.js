#!/usr/bin/env node

import { Command } from 'commander';
import packageJson from '../package.json' with { type: 'json' };
import { generate } from '../lib/generate/index.js';

const program = new Command();

/**
 * Parser for , separated list
 * @param {String} val
 * @returns {String[]}
 */
function list(val) {
    return val.split(',');
}

program
    .version(packageJson.version)
    .usage('[options]')
    .description('Creates files relative to the current folder')
    .option('-t, --types [types]', 'List of file types separated by comma', list)
    .option('-i, --items [items]', 'List of entities separated by comma', list)
    .option('-d, --dry-run [dryRun]', 'Do not create files and folders', Boolean)
    .action((options) => {
        const types = Array.isArray(options.types) ? options.types : [];
        const items = Array.isArray(options.items) ? options.items : [''];

        generate({
            targetPath: process.cwd(),
            types,
            items,
            dryRun: options.dryRun,
        });
    })
    .command('init [override] [dryRun]', 'Initializes all default settings', { executableFile: 'init' })
    .command('print-templates', 'Prints the list of templates', { executableFile: 'print-templates' });

program.parse(process.argv);
