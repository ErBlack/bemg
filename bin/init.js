#!/usr/bin/env node

import { Command } from 'commander';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copy } from '../lib/copy.js';

const program = new Command();

program
    .description('Creates a folder with bemg settings in the current directory')
    .option('-o, --override [override]', 'Overwrite files and folders of default settings', Boolean)
    .option('-d, --dry-run [dryRun]', 'Do not create files and folders', Boolean)
    .action(({ override, dryRun }) => {
        const templatesSource = resolve(fileURLToPath(new URL('../bemg', import.meta.url)));
        const targetPath = resolve(process.cwd(), './bemg');

        copy(templatesSource, targetPath, override, dryRun);
    });

program.parse(process.argv);
