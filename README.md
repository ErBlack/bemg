## Installation

```bash
npm install -g bemg
```

## Configuration

* Templates for creating files are located in `bemg/templates`
* Package settings are located in `bemg/config.json`

### config.aliases
List of abbreviations for file types

### config.naming
Naming settings for the bem-naming package

## Usage
### bemg 

```Usage: bemg bemg [name] [options]

creates files relative to the current folder, or new folder with given name if
name passed

Arguments:
  name                      Create block with given name

Options:
  -V, --version             output the version number
  -t, --types [types]       List of file types separated by comma
  -i, --items [items]       List of entities separated by comma
  -d, --dry-run [dryRun]    Do not create files and folders
  -h, --help                display help for command

Commands:
  init [override] [dryRun]  Initializes all default settings
  print-templates           Prints the list of templates
  mcp                       Start MCP server for AI agents
```

### bemg init

```Usage: bemg init [options]

Creates a folder with bemg settings in the current directory

Options:
  -o, --override [override]  Overwrite files and folders of default settings
  -d, --dry-run [dryRun]     Do not create files and folders
  -h, --help                 display help for command
```

### bemg print-templates

```Usage: bemg print-templates [options]

Outputs the list of templates

Options:
  -h, --help  display help for command
```

### bemg mcp

```Usage: bemg mcp [options]

Start MCP (Model Context Protocol) server for AI agents. Exposes bemg
capabilities to AI assistants.

Options:
  -h, --help  display help for command

Configuration:
    {
      "mcpServers": {
        "bemg": {
          "command": "npx",
          "args": ["bemg@latest", "mcp"]
        }
      }
    }
```

## License 

The code is released under the [Mozilla Public License 2.0](LICENSE.txt).