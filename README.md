## Установка

```bash
npm install -g --registry https://npm.yandex-team.ru bemg
```

## Настройка

* В `bemg/templates` лежат шаблоны для создания файлов
* В `bemg/bemg.config.js` лежит конфиг для bemg

### Формат конфига

```ts
type Config = {
  aliases: Record<string, string>, // шорткаты для сокращенного наименования типов файлов
  naming: { // настройка нейминга BEM
    elem: "__", // разделитель элемента
    mod: { name: "_", val: "_" }, // разделители модов
    wordPattern?: RegExp | string, // регекс допустимого имени (например, при использовании - в качестве разделителя нельзя использовать этот символ в имени)

    // опциональный метод для кастомной генерации имени файла (возврат falsy значения будет использовать поведение по умолчанию)
    generateFileName?: (bemString: string, fileType: string, bemEntity: Object) => string | false,
    // опциональный метод для кастомной генерации имени папки (возврат falsy значения будет использовать поведение по умолчанию)
    generateFolderName?: (entity: Object, entityType: string) => string | false
  }
};

```

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
