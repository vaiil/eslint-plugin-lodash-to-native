# eslint-plugin-lodash-to-native

Lodash to native

## Установка

```shell script
npm i eslint --save-dev
npm install vaiil/eslint-plugin-lodash-to-native --save-dev
```

## Usage

Add `lodash-to-native` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "lodash-to-native"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "lodash-to-native/map": 2
    }
}
```

## Как работают правила
В случае передачи явного литерала массива будет произведена метода на метод map: \
`_.map([], f)` => `[].map(f)`

В случае передачи переменной вызов будет обернут в проверку:
`_.map(a, f)` => `(Array.isArray(a) ? a.map(f) : _.map(a, f))`

Если выше вызова `_.map` есть одна из следующих проверок: 
* `Array.isArray`
* `variable instanceof Array`  
то переменная будет воспринята как массив и замена будет произведена без проверки.
В случае отрицательной проверки переменная будет определяться как не-массив, 
и линтер не будет возвращать предупреждение.  




## Комментарии 

 В работе использовал [generator-eslint](https://github.com/eslint/generator-eslint) для создания каркаса приложения 
 (затем еще обновил зависимости).
 
 Также были полезны следующие сервисы:
 * [esquery online](https://estools.github.io/esquery/) для составления верного селектора
 * [ast explorer](https://astexplorer.net/) для просмотра ast дерева
 
 
