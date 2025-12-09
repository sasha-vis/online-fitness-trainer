import { WorkoutTemplate } from '@shared/stores/workout/workout-types';

export const workoutTemplates: WorkoutTemplate[] = [
    {
        name: 'Похудение',
        description: 'Кардио и HIIT для сжигания жира.',
        exercises: [
            {
                name: 'Бег на месте',
                reps: '3x30 сек',
                description: 'Высокая интенсивность.',
            },
            {
                name: 'Прыжки со скакалкой',
                reps: '4x40 сек',
                description: 'Улучшает координацию.',
            },
        ],
    },
    {
        name: 'Набор массы',
        description: 'Гипертрофия с compound lifts.',
        exercises: [
            { name: 'Приседания', reps: '4x10', description: 'Фокус на ноги.' },
            { name: 'Жим лежа', reps: '3x8-12', description: 'Грудь и трицепс.' },
        ],
    },
    {
        name: 'Баланс',
        description: 'Сбалансированный фитнес для общего здоровья.',
        exercises: [
            { name: 'Планка', reps: '3x30 сек', description: 'Core stability.' },
            { name: 'Йога позы', reps: '5x держание', description: 'Гибкость.' },
        ],
    },
    {
        name: 'Сила',
        description: 'Низкие reps с тяжелыми весами.',
        exercises: [
            { name: 'Становая тяга', reps: '5x5', description: 'Полное тело.' },
            { name: 'Жим над головой', reps: '4x6', description: 'Плечи.' },
        ],
    },
    {
        name: 'Выносливость',
        description: 'Длинные сессии для stamina.',
        exercises: [
            { name: 'Бег', reps: '45 мин', description: 'Steady-state.' },
            { name: 'Велосипед', reps: '30 мин', description: 'Низкая интенсивность.' },
        ],
    },
    {
        name: 'Гибкость',
        description: 'Стретчинг и йога.',
        exercises: [
            { name: 'Растяжка ног', reps: '3x1 мин', description: 'Hamstrings.' },
            { name: 'Поза кобры', reps: '4x30 сек', description: 'Спина.' },
        ],
    },
    {
        name: 'HIIT',
        description: 'Высокая интенсивность интервалы.',
        exercises: [
            { name: 'Берпи', reps: '4x30 сек', description: 'Full body.' },
            {
                name: 'Горные альпинисты',
                reps: '3x40 сек',
                description: 'Core и cardio.',
            },
        ],
    },
    {
        name: 'Функциональный фитнес',
        description: 'Движения для повседневной жизни.',
        exercises: [
            { name: 'Шаги вверх', reps: '3x15', description: 'Ноги и баланс.' },
            { name: 'TRX rows', reps: '4x10', description: 'Спина.' },
        ],
    },
    {
        name: 'Восстановление',
        description: 'Легкие упражнения для mobility.',
        exercises: [
            { name: 'Foam rolling', reps: '10 мин', description: 'Массаж мышц.' },
            { name: 'Динамическая растяжка', reps: '3x1 мин', description: 'Суставы.' },
        ],
    },
    {
        name: 'Для пожилых',
        description: 'Низкая нагрузка для старшего возраста.',
        exercises: [
            {
                name: 'Сидячие приседания',
                reps: '3x12',
                description: 'Безопасно для ног.',
            },
            { name: 'Стеновые отжимания', reps: '3x10', description: 'Грудь.' },
        ],
    },
];
