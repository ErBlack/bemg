'use strict';

const exec = require('child_process').execSync;
const COMMAND = /^\s{2}(\w[-\w]*)/;

const DOC = `## Установка

\`\`\`bash
npm install -g --registry https://npm.yandex-team.ru bemg
\`\`\`

## Настройка

* В \`bemg/templates\` лежат шаблоны для создания файлов
* В \`bemg/aliases.json\` лежат шорткаты для сокращенного наименования шаблонов файлов

## Использование`;

/**
 * Генерирует документацию команды
 * @param {String} command
 * @returns {String}
 */
function buildCommandDoc(command) {
    const commandHelp = help(command);
    const subcommands = commands(commandHelp);

    return `
### bemg ${command}

\`\`\`${commandHelp.replace('Usage: ', 'Usage: bemg ')}\`\`\`
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
 * @param {String} str
 * @returns {Array}
 */
function commands(str) {
    return str.split('Commands:\n').pop().split('\n').reduce(function(result, str) {
        const [, subcommand] = COMMAND.exec(str) || [];

        if (subcommand) {
            result.push(`${subcommand}`);
        }

        return result;
    }, []);
}

process.stdout.write(`${DOC}${buildCommandDoc('')}`);
process.exit(0);