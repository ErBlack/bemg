#!/usr/bin/env node

const commander = require("commander");
const TaskGenerate = require("../lib/TaskGenerate");

const program = new commander.Command();

/**
 * Парсер параметров разделенных ,
 * @param {String} val
 * @returns {Array}
 */
function list(val) {
    return val.split(',');
}

program
    .version(require("../package").version)
    .usage("[options]")
    .description("Создаёт файлы относительно текущей папки")
    .option("-t, --types [types]", "Список типов файлов через запятую", list)
    .option("-i, --items [items]", "Список сущностей через запятую", list)
    .option("-d, --dry-run [dryRun]", "Не создавать файлы и папки", Boolean)
    .option("-n, --naming [naming]", "Выбор нейминга БЭМ", String)
    .action((options) => {
        const types = Array.isArray(options.types) ? options.types : [];
        const items = Array.isArray(options.items) ? options.items : [""];
        const naming = typeof options.naming === 'string' ? options.naming : 'origin';

        const task = new TaskGenerate(process.cwd(), naming);
        task.write(types, items, options.dryRun);
    })
    .command("init [override] [dryRun]", "Инициализирует все дефолтные настройки", { executableFile: 'init' })

program.parse(process.argv);
