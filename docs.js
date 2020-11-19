'use strict';

const exec = require('child_process').execSync;
const fs = require('fs');
const COMMAND = /^\s{4}(\w[-\w]*)/;

const DOC = '';

/**
 * Генерирует документацию команды
 * @param {String} command
 * @returns {String}
 */
function buildCommandDoc(command) {
    const commandHelp = help(command);
    const subcommands = commands(command, commandHelp);

    return `
### bemg ${command}

\`\`\`${commandHelp.replace('Usage: bemg-', 'Usage: bemg ')}\`\`\`
${subcommands.map(buildCommandDoc).join('')}`
}

/**
 * Получает help команды
 * @param {String} command
 * @returns {String}
 */
function help(command) {
    return String(exec(`node ./bin/bemg.js ${command} --help`))
}

/**
 * Находит вложенные команды
 * @param {String} command
 * @param {String} str
 * @returns {Array}
 */
function commands(command, str) {
    if (command) {
        command += ' ';
    }

    return str.split('\n').reduce(function(result, str) {
        let substr = COMMAND.exec(str);

        if (substr && substr[1] !== 'help') {
            result.push(`${command} ${substr[1]}`);
        }

        return result;
    }, []);
}

process.stdout.write(`${DOC} ${buildCommandDoc('')}`);
process.exit(0);