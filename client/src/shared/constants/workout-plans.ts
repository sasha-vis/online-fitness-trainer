import { WorkoutPlan } from '@shared/stores/workout/workout-types';

export const workoutPlans: WorkoutPlan[] = [
    {
        name: 'Похудение с большим кардио',
        description: 'HIIT и cardio для дефицита.',
        exercises: [
            { name: 'Спринты', reps: '4x30 сек', description: 'Интервалы.' },
            { name: 'Велосипед', reps: '20 мин', description: 'Steady.' },
        ],
    },
    {
        name: 'Набор массы для начинающих',
        description: 'Full body 3 дня/неделю.',
        exercises: [
            { name: 'Приседания', reps: '3x10', description: 'Ноги.' },
            { name: 'Отжимания', reps: '3x12', description: 'Грудь.' },
        ],
    },
    {
        name: 'Сила 5x5',
        description: 'Классика для power.',
        exercises: [
            { name: 'Жим лежа', reps: '5x5', description: 'Грудь.' },
            { name: 'Тяга', reps: '5x5', description: 'Спина.' },
        ],
    },
    {
        name: 'Push/Pull/Legs продвинутый',
        description: '6 дней/неделю для гипертрофии.',
        exercises: [
            { name: 'Жим ногами', reps: '4x8-12', description: 'Ноги.' },
            { name: 'Подтягивания', reps: '3x10', description: 'Спина.' },
        ],
    },
    {
        name: 'Upper/Lower сплит',
        description: '4 дня/неделю для баланса.',
        exercises: [
            { name: 'Верх: Жим над головой', reps: '3x8', description: 'Плечи.' },
            { name: 'Низ: Выпады', reps: '3x12', description: 'Ноги.' },
        ],
    },
    {
        name: 'Bro Split',
        description: 'По мышцам, для бодибилдинга.',
        exercises: [
            { name: 'Грудь день: Flyes', reps: '3x12', description: 'Изоляция.' },
            { name: 'Спина день: Rows', reps: '4x10', description: 'Тяга.' },
        ],
    },
    {
        name: '3-Day Split',
        description: 'Для занятых, full body вариации.',
        exercises: [
            { name: 'День A: Squats', reps: '3x10', description: 'Ноги.' },
            { name: 'День B: Bench', reps: '3x8', description: 'Грудь.' },
        ],
    },
    {
        name: 'Атлетическая производительность',
        description: 'Plyometrics для спорта.',
        exercises: [
            { name: 'Box jumps', reps: '4x8', description: 'Взрывная сила.' },
            { name: 'Agility drills', reps: '3x10', description: 'Ловкость.' },
        ],
    },
    {
        name: 'Core & Flexibility',
        description: 'Фокус на ядре и растяжке.',
        exercises: [
            { name: 'Russian twists', reps: '3x15', description: 'Core.' },
            { name: 'Leg swings', reps: '3x12', description: 'Гибкость.' },
        ],
    },
    {
        name: 'Endurance Training',
        description: 'Длинные cardio сессии.',
        exercises: [
            { name: 'Бег', reps: '45 мин', description: 'Steady-state.' },
            { name: 'Swings', reps: '3x15', description: 'Сила endurance.' },
        ],
    },
    {
        name: 'Recovery & Mobility',
        description: 'Для предотвращения травм.',
        exercises: [
            { name: 'Yoga flow', reps: '30 мин', description: 'Полное тело.' },
            { name: 'Stretches', reps: '3x1 мин', description: 'Мышцы.' },
        ],
    },
    {
        name: 'Senior Fitness',
        description: 'Низкоударный для пожилых.',
        exercises: [
            { name: 'Balance holds', reps: '3x10 сек', description: 'Стабильность.' },
            { name: 'Seated curls', reps: '3x12', description: 'Руки.' },
        ],
    },
];
