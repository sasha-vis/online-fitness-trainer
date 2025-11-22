module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat', // новая функциональность
                'fix', // исправление бага
                'docs', // документация
                'style', // форматирование, точки с запятой
                'refac', // рефакторинг (ты сократил - ок!)
                'test', // тесты
                'chore', // рутинные задачи, обновление сборки
                'perf', // производительность
            ],
        ],
        'subject-case': [2, 'always', 'lower-case'], // весь текст в нижнем регистре
    },
};
