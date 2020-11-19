#!/usr/bin/env node

const commander = require('commander');
const Task = require('../lib/Task');

/**
 * Парсер параметров разделенных ,
 * @param {String} val 
 * @returns {Array}
 */
function list(val) {
    return val.split(',');
}

commander
    .version(require('../package').version)
    .usage('[options] <path>')
    .description('Создаёт файлы')
    .option('-t, --types [types]', 'Список типов файлов через запятую', list)
    .option('-i, --items [items]', 'Список сущностей через запятую', list)
    .option('-d --dry-run [dryRun]', 'Не создавать файлы и папки', Boolean)
    .parse(process.argv);

const types = Array.isArray(commander.types) ? commander.types : [];
const items = Array.isArray(commander.items) ? commander.items : [''];

if (commander.args[0]) {
    const task = new Task(commander.args[0]);

    task.write(types, items, commander.dryRun);
}
