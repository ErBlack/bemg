#!/usr/bin/env node

const { Command } = require('commander');
const copy = require('../lib/copy');
const { join, resolve } = require('path');

const program = new Command();

program
    .description('Создаёт папку с настройками bemg в текущей директории')
    .option('-o, --override [override]', 'Перезаписать файлы и папки дефолтных настроек', Boolean)
    .option('-d, --dry-run [dryRun]', 'Не создавать файлы и папки', Boolean)
    .action(({ override, dryRun }) => {
        copy(join(resolve(__dirname, '..'), 'bemg'), join(resolve(process.cwd(), './bemg')), override, dryRun);
    });

program.parse(process.argv);
