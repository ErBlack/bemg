## Установка

```bash
npm install -g --registry https://npm.yandex-team.ru bemg
```

## Настройка

* В `bemg/templates` лежат шаблоны для создания файлов
* В `bemg/config.json` лежат настройки пакета

### config.aliases
Список сокращений для типов файлов

### config.naming
Настройки нейминга для пакета bem-naming

## Использование
### bemg 

```Usage: bemg bemg [options]

Создаёт файлы относительно текущей папки

Options:
  -V, --version             output the version number
  -t, --types [types]       Список типов файлов через запятую
  -i, --items [items]       Список сущностей через запятую
  -d, --dry-run [dryRun]    Не создавать файлы и папки
  -h, --help                display help for command

Commands:
  init [override] [dryRun]  Инициализирует все дефолтные настройки
```

### bemg init

```Usage: bemg init [options]

Создаёт папку с настройками bemg в текущей директории

Options:
  -o, --override [override]  Перезаписать файлы и папки дефолтных настроек
  -d, --dry-run [dryRun]     Не создавать файлы и папки
  -h, --help                 display help for command
```
