#!/usr/bin/env node

const { Command} = require("commander");
const TaskInit = require("../lib/TaskInit");
const { join, resolve } = require("path");

const program = new Command();

program
    .option(
        "-o, --override [override]",
        "Перезаписать файлы и папки дефолтных настроек",
        Boolean
    )
    .option("-d, --dry-run [dryRun]", "Не создавать файлы и папки", Boolean)

program.parse(process.argv);

const taskInit = new TaskInit();

taskInit.copy(
    join(resolve(__dirname, ".."), "bemg"),
    join(resolve(process.cwd(), './bemg')),
    program.override,
    program.dryRun
);

