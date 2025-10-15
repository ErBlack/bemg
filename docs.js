import { execSync } from 'node:child_process';

const COMMAND = /^\s{2}(\w[-\w]*)/;

const DOC = `## Installation

\`\`\`bash
npm install bemg
\`\`\`

## Configuration

* Templates for creating files are located in \`bemg/templates\`
* Package settings are located in \`bemg/config.json\`

### config.aliases
List of abbreviations for file types

### config.naming
Naming settings for the bem-naming package

## Usage`;

/**
 * Generates command documentation
 * @param {String} command
 * @returns {String}
 */
function buildCommandDoc(command) {
    const commandHelp = help(command);
    const subcommands = commands(commandHelp);

    return `
### bemg ${command}

\`\`\`${commandHelp.replace('Usage: ', 'Usage: bemg ')}\`\`\`
${subcommands.map(buildCommandDoc).join('')}`;
}

/**
 * Gets command help
 * @param {String} command
 * @returns {String}
 */
function help(command) {
    return String(execSync(`node ./bin/bemg.js ${command} --help`));
}

/**
 * Finds nested commands
 * @param {String} str
 * @returns {Array}
 */
function commands(str) {
    return str
        .split('Commands:\n')
        .pop()
        .split('\n')
        .reduce(function (result, str) {
            const [, subcommand] = COMMAND.exec(str) || [];

            if (subcommand) {
                result.push(`${subcommand}`);
            }

            return result;
        }, []);
}

process.stdout.write(`${DOC}${buildCommandDoc('')}
## License 

© 2022 YANDEX LLC. The code is released under the [Mozilla Public License 2.0](LICENSE.txt).`);
process.exit(0);
