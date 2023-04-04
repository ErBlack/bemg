#!/usr/bin/env node

const commander = require("commander");
const generate = require("../lib/generate");

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
    .action((options) => {
        const types = Array.isArray(options.types) ? options.types : [];
        const items = Array.isArray(options.items) ? options.items : [""];

        generate({
            targetPath: process.cwd(),
            types,
            items,
            dryRun: options.dryRun
        });
    })
    .command("init [override] [dryRun]", "Инициализирует все дефолтные настройки", { executableFile: 'init' })
    .command("print-templates", "Инициализирует все дефолтные настройки", { executableFile: 'print-templates' })

program.parse(process.argv);
