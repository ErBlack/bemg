#!/usr/bin/env node

import { Command } from 'commander';
import { analyze } from '../lib/analyze/index.js';

const program = new Command();

program.description('Outputs the BEM entity of the current folder').action(() => {
    const { currentEntity, blockRoot } = analyze(process.cwd());

    process.stdout.write(
        `\x1b[32m${currentEntity.string}\x1b[0m \x1b[90m${currentEntity.type}\x1b[0m\nblock root: ${blockRoot}\n`,
    );
});

program.parse(process.argv);
