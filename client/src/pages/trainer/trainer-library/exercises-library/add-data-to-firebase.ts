import { db } from '@/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';

export const initializeExercisesInFirebase = async () => {
    try {
        const exercisesRef = collection(db, 'exercises');
        const snapshot = await getDocs(exercisesRef);

        // Если в базе уже есть упражнения, не добавляем моковые данные
        if (snapshot.size > 0) {
            console.log('Упражнения уже существуют в базе данных');
            return;
        }

        const mockExercises = [
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Жим штанги лежа',
                sets: 4,
                reps: '8-10',
                muscleGroup: 'Грудь',
                description:
                    'Лягте на скамью, ноги на полу. Возьмите штангу хватом шире плеч. Опустите штангу до касания груди, затем выжмите вверх. Держите спину прижатой к скамье.',
                videoUrl: 'https://www.youtube.com/embed/4Y2ZeMCApEQ',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Приседания со штангой',
                sets: 4,
                reps: '6-8',
                muscleGroup: 'Ноги',
                description:
                    'Поместите штангу на трапеции. Ноги на ширине плеч, носки слегка развернуты. Опускайтесь до параллели бедер с полом, держите спину прямой.',
                videoUrl: 'https://www.youtube.com/embed/bEv6CCg2BC8',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Становая тяга',
                sets: 3,
                reps: '5-7',
                muscleGroup: 'Спина',
                description:
                    'Ноги на ширине плеч, штанга перед голенями. Спина прямая, грудь вперед. Поднимите штангу за счет ног и спины, затем опустите.',
                videoUrl: 'https://www.youtube.com/embed/1ZXobu7JvvE',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Подтягивания',
                sets: 3,
                reps: '8-12',
                muscleGroup: 'Спина',
                description:
                    'Возьмитесь за перекладину хватом шире плеч. На выдохе подтянитесь до касания перекладины подбородком. Контролируйте опускание.',
                videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Жим гантелей сидя',
                sets: 3,
                reps: '10-12',
                muscleGroup: 'Плечи',
                description:
                    'Сядьте на скамью с опорой для спины. Поднимите гантели до уровня плеч ладонями вперед. Выжмите гантели вверх одновременно.',
                videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Тяга штанги в наклоне',
                sets: 3,
                reps: '8-10',
                muscleGroup: 'Спина',
                description:
                    'Ноги согнуты в коленях, корпус параллелен полу. Возьмите штангу хватом шире плеч. Тяните штангу к поясу, сводя лопатки.',
                videoUrl: 'https://www.youtube.com/embed/9efgcAjQe7E',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Сгибания рук со штангой',
                sets: 3,
                reps: '10-12',
                muscleGroup: 'Бицепс',
                description:
                    'Стоя, ноги на ширине плеч. Возьмите штангу хватом снизу. Согните руки в локтях, поднимая штангу к груди. Не раскачивайтесь.',
                videoUrl: 'https://www.youtube.com/embed/sAq_ocpRh_I',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Французский жим',
                sets: 3,
                reps: '10-12',
                muscleGroup: 'Трицепс',
                description:
                    'Лежа на скамье, держите штангу прямыми руками над грудью. Согните руки в локтях, опуская штангу ко лбу. Выпрямите руки.',
                videoUrl: 'https://www.youtube.com/embed/_gsUck-7M74',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Выпады с гантелями',
                sets: 3,
                reps: '10-12',
                muscleGroup: 'Ноги',
                description:
                    'Стоя, держите гантели в руках. Сделайте шаг вперед, опуститесь до параллели бедра с полом. Вернитесь в исходное положение.',
                videoUrl: 'https://www.youtube.com/embed/D7KaRcUTQeE',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Жим ногами',
                sets: 4,
                reps: '10-12',
                muscleGroup: 'Ноги',
                description:
                    'Сядьте в тренажер, поставьте ноги на платформу на ширине плеч. Опустите платформу, затем выжмите ее ногами. Не выпрямляйте колени полностью.',
                videoUrl: 'https://www.youtube.com/embed/IZxyjW7MPJQ',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Разводка гантелей лежа',
                sets: 3,
                reps: '12-15',
                muscleGroup: 'Грудь',
                description:
                    'Лежа на скамье, держите гантели над грудью. Разведите руки в стороны, слегка согнув локти. Верните гантели в исходное положение.',
                videoUrl: 'https://www.youtube.com/embed/eozdVDA78K0',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Тяга верхнего блока',
                sets: 3,
                reps: '10-12',
                muscleGroup: 'Спина',
                description:
                    'Сядьте в тренажер, возьмитесь за рукоять широким хватом. Тяните рукоять к груди, сводя лопатки. Медленно верните в исходное положение.',
                videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Махи гантелями в стороны',
                sets: 3,
                reps: '12-15',
                muscleGroup: 'Плечи',
                description:
                    'Стоя, держите гантели по бокам. Поднимите руки в стороны до уровня плеч. Контролируйте опускание.',
                videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Подъем на носки стоя',
                sets: 4,
                reps: '15-20',
                muscleGroup: 'Икры',
                description:
                    'Стоя в тренажере, опустите пятки как можно ниже. Поднимитесь на носки максимально высоко. Задержитесь на секунду.',
                videoUrl: 'https://www.youtube.com/embed/-M4-G8p8fmc',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Скручивания на пресс',
                sets: 3,
                reps: '15-20',
                muscleGroup: 'Пресс',
                description:
                    'Лежа на полу, согните ноги в коленях. Положите руки за голову. Поднимите верхнюю часть тела, напрягая пресс. Опуститесь.',
                videoUrl: 'https://www.youtube.com/embed/MKmrqcoCZ-M',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Жим штанги на наклонной',
                sets: 4,
                reps: '8-10',
                muscleGroup: 'Грудь',
                description:
                    'Лежа на наклонной скамье, возьмите штангу хватом шире плеч. Опустите штангу к верхней части груди, затем выжмите вверх.',
                videoUrl: 'https://www.youtube.com/embed/DbFgad9f0o0',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Румынская тяга',
                sets: 3,
                reps: '10-12',
                muscleGroup: 'Ноги',
                description:
                    'Стоя, держите штангу перед бедрами. Наклонитесь вперед, отводя таз назад. Опустите штангу до середины голеней. Вернитесь.',
                videoUrl: 'https://www.youtube.com/embed/_oyxCn2iSjU',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Подъем штанги на бицепс обратным хватом',
                sets: 3,
                reps: '10-12',
                muscleGroup: 'Бицепс',
                description:
                    'Стоя, возьмите штангу хватом сверху. Поднимите штангу к груди, напрягая бицепсы. Опустите медленно.',
                videoUrl: 'https://www.youtube.com/embed/vngli9UR6Hw',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Отжимания на брусьях',
                sets: 3,
                reps: '8-12',
                muscleGroup: 'Трицепс',
                description:
                    'Удерживайтесь на брусьях прямыми руками. Опуститесь, сгибая локти до угла 90 градусов. Выжмитесь вверх.',
                videoUrl: 'https://www.youtube.com/embed/0295M0fIHSc',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Гиперэкстензия',
                sets: 3,
                reps: '12-15',
                muscleGroup: 'Спина',
                description:
                    'Лежа в тренажере, зафиксируйте ноги. Опустите корпус вниз. Поднимите корпус до прямой линии с ногами.',
                videoUrl: 'https://www.youtube.com/embed/ph3pddpKzzw',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Подъем гантелей на бицепс сидя',
                sets: 3,
                reps: '10-12',
                muscleGroup: 'Бицепс',
                description:
                    'Сидя на скамье, держите гантели в опущенных руках. Поочередно сгибайте руки, поднимая гантели к плечам.',
                videoUrl: 'https://www.youtube.com/embed/sLqEgB16GQk',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Разгибания рук на блоке',
                sets: 3,
                reps: '12-15',
                muscleGroup: 'Трицепс',
                description:
                    'Стоя у блока, возьмитесь за рукоять хватом сверху. Разогните руки в локтях, напрягая трицепсы. Верните в исходное положение.',
                videoUrl: 'https://www.youtube.com/embed/2-LAMcpzODU',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Жим гантелей лежа',
                sets: 4,
                reps: '8-10',
                muscleGroup: 'Грудь',
                description:
                    'Лежа на скамье, держите гантели на уровне груди. Выжмите гантели вверх, сводя их в верхней точке.',
                videoUrl: 'https://www.youtube.com/embed/VKuVdp4gZ5Q',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Тяга гантели одной рукой',
                sets: 3,
                reps: '10-12',
                muscleGroup: 'Спина',
                description:
                    'Упритесь коленом и рукой в скамью. Держите гантель в свободной руке. Подтяните гантель к поясу, отводя локоть назад.',
                videoUrl: 'https://www.youtube.com/embed/roCP6wCXPqo',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Подъем ног в висе',
                sets: 3,
                reps: '10-15',
                muscleGroup: 'Пресс',
                description:
                    'Повисните на перекладине. Поднимите ноги до параллели с полом или выше. Опустите медленно.',
                videoUrl: 'https://www.youtube.com/embed/hUzV3Mc2Jqs',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Жим штанги стоя',
                sets: 4,
                reps: '6-8',
                muscleGroup: 'Плечи',
                description:
                    'Стоя, держите штангу на груди. Выжмите штангу над головой. Опустите на грудь. Держите корпус напряженным.',
                videoUrl: 'https://www.youtube.com/embed/Gyh8M1kLhno',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Сведение рук в кроссовере',
                sets: 3,
                reps: '12-15',
                muscleGroup: 'Грудь',
                description:
                    'Стоя между блоками, возьмитесь за рукояти. Сведите руки перед собой, как будто обнимаете дерево.',
                videoUrl: 'https://www.youtube.com/embed/taI4XduLpTk',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Тяга нижнего блока',
                sets: 3,
                reps: '10-12',
                muscleGroup: 'Спина',
                description:
                    'Сидя в тренажере, упритесь ногами. Возьмитесь за рукоять и тяните к животу, сводя лопатки.',
                videoUrl: 'https://www.youtube.com/embed/GZbfZ033f74',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Подъем гантелей перед собой',
                sets: 3,
                reps: '12-15',
                muscleGroup: 'Плечи',
                description:
                    'Стоя, держите гантели перед бедрами. Поднимите гантели до уровня глаз. Опустите медленно.',
                videoUrl: 'https://www.youtube.com/embed/-t7fuZ0KhDA',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: 'Планка',
                sets: 3,
                reps: '30-60 сек',
                muscleGroup: 'Пресс',
                description:
                    'Примите упор лежа на предплечьях. Держите тело прямо от головы до пят. Напрягите пресс и ягодицы.',
                videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw',
            },
        ];

        console.log('Начинаю добавление упражнений в Firebase...');

        // Добавляем все упражнения в Firebase
        for (const exercise of mockExercises) {
            await addDoc(exercisesRef, exercise);
        }

        console.log(`Успешно добавлено ${mockExercises.length} упражнений в Firebase`);
    } catch (error) {
        console.error('Ошибка при инициализации упражнений:', error);
    }
};
