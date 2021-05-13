## Усиановка

```bash
npm install -g --registry https://npm.yandex-team.ru bemg
```

## Настройка

В `bemg/templates` лежат шаблоны для создания файлов
В `bemg/aliases.json` лежат шорткаты для сокращенного наименования шаблонов файлов

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

Options:
  -o, --override [override]  Перезаписать файлы и папки дефолтных настроек
  -d, --dry-run [dryRun]     Не создавать файлы и папки
  -h, --help                 display help for command
```
