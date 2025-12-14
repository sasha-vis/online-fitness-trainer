// export const workoutPlan1 = {
export const workoutPlan = [
    {
        goal: 'Набор мышечной массы',
        workouts: [
            {
                id: '1',
                name: 'День 1 - Спина и бицепс',
                sections: [
                    {
                        title: 'Спина',
                        exercises: [
                            {
                                name: 'Становая тяга',
                                sets: 4,
                                reps: '8-10',
                                weight: 60,
                                rest: 90,
                                comments: 'С правильной техникой, прогрессия веса',
                                video: '',
                            },
                            {
                                name: 'Тяга штанги в наклоне',
                                sets: 3,
                                reps: '10-12',
                                weight: 40,
                                rest: 75,
                                video: '',
                            },
                            {
                                name: 'Тяга верхнего блока',
                                sets: 3,
                                reps: '10-12',
                                weight: 35,
                                rest: 60,
                                video: '',
                            },
                        ],
                    },
                    {
                        title: 'Бицепс',
                        exercises: [
                            {
                                name: 'Подъем штанги на бицепс',
                                sets: 3,
                                reps: '10-12',
                                weight: 20,
                                rest: 60,
                                video: '',
                            },
                            {
                                name: 'Молотки с гантелями',
                                sets: 3,
                                reps: '12-15',
                                weight: 10,
                                rest: 60,
                                video: '',
                            },
                        ],
                    },
                ],
            },
            {
                id: '2',
                name: 'День 2 - Грудь и трицепс',
                sections: [
                    {
                        title: 'Грудь',
                        exercises: [
                            {
                                name: 'Жим штанги лежа',
                                sets: 4,
                                reps: '8-10',
                                weight: 50,
                                rest: 90,
                                comments: 'На горизонтальной скамье',
                                video: '',
                            },
                            {
                                name: 'Жим гантелей на наклонной',
                                sets: 3,
                                reps: '10-12',
                                weight: 18,
                                rest: 75,
                                video: '',
                            },
                        ],
                    },
                    {
                        title: 'Трицепс',
                        exercises: [
                            {
                                name: 'Французский жим',
                                sets: 3,
                                reps: '10-12',
                                weight: 15,
                                rest: 60,
                                video: '',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        goal: 'Похудение и тонус',
        workouts: [
            {
                id: '1',
                name: 'День 1 - Кардио + Верх тела',
                sections: [
                    {
                        title: 'Кардио',
                        exercises: [
                            {
                                name: 'Беговая дорожка',
                                sets: 1,
                                reps: '20 минут',
                                weight: 0,
                                rest: 0,
                                comments:
                                    'Интервальный бег 2/1 (2 мин бег, 1 мин ходьба)',
                                video: '',
                            },
                        ],
                    },
                    {
                        title: 'Круговая тренировка',
                        exercises: [
                            {
                                name: 'Отжимания',
                                sets: 3,
                                reps: '15-20',
                                weight: 0,
                                rest: 45,
                                video: '',
                            },
                            {
                                name: 'Подтягивания (с резиной)',
                                sets: 3,
                                reps: '8-12',
                                weight: 0,
                                rest: 45,
                                video: '',
                            },
                            {
                                name: 'Приседания с собственным весом',
                                sets: 3,
                                reps: '20-25',
                                weight: 0,
                                rest: 45,
                                video: '',
                            },
                        ],
                    },
                ],
            },
            {
                id: '2',
                name: 'День 2 - Ниж тела и пресс',
                sections: [
                    {
                        title: 'Ноги и ягодицы',
                        exercises: [
                            {
                                name: 'Выпады с гантелями',
                                sets: 3,
                                reps: '12-15 на каждую ногу',
                                weight: 8,
                                rest: 60,
                                video: '',
                            },
                            {
                                name: 'Ягодичный мостик',
                                sets: 3,
                                reps: '15-20',
                                weight: 0,
                                rest: 45,
                                video: '',
                            },
                        ],
                    },
                    {
                        title: 'Пресс',
                        exercises: [
                            {
                                name: 'Скручивания',
                                sets: 3,
                                reps: '20-25',
                                weight: 0,
                                rest: 30,
                                video: '',
                            },
                            {
                                name: 'Планка',
                                sets: 3,
                                reps: '45-60 секунд',
                                weight: 0,
                                rest: 30,
                                video: '',
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
