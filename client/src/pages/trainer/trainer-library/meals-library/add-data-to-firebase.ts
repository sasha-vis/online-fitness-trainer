import { db } from '@/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';

export const initializeDishesInFirebase = async () => {
    try {
        const dishesRef = collection(db, 'meals');
        const snapshot = await getDocs(dishesRef);

        // Если в базе уже есть блюда, не добавляем моковые данные
        if (snapshot.size > 0) {
            console.log('Блюда уже существуют в базе данных');
            return;
        }

        const mockDishes = [
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Куриная грудка на гриле',
                calories: 165,
                protein: 31,
                carbs: 0,
                fat: 3.6,
                category: 'Основные блюда',
                description:
                    'Куриная грудка, приготовленная на гриле с минимальным количеством масла. Отличный источник белка.',
                recipeUrl: 'https://www.youtube.com/embed/example1',
                cookingTime: '20-25 мин',
                difficulty: 'Легко',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Овсянка с ягодами',
                calories: 250,
                protein: 10,
                carbs: 45,
                fat: 5,
                category: 'Завтраки',
                description:
                    'Овсяные хлопья, приготовленные на воде или молоке, с добавлением свежих ягод и меда.',
                recipeUrl: 'https://www.youtube.com/embed/example2',
                cookingTime: '15 мин',
                difficulty: 'Легко',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Салат с тунцом',
                calories: 180,
                protein: 22,
                carbs: 8,
                fat: 7,
                category: 'Салаты',
                description:
                    'Консервированный тунец, яйца, огурцы, помидоры и зелень, заправленные оливковым маслом.',
                recipeUrl: 'https://www.youtube.com/embed/example3',
                cookingTime: '10 мин',
                difficulty: 'Легко',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Творожная запеканка',
                calories: 200,
                protein: 18,
                carbs: 20,
                fat: 6,
                category: 'Десерты',
                description:
                    'Запеканка из обезжиренного творога с яйцами и небольшим количеством манки.',
                recipeUrl: 'https://www.youtube.com/embed/example4',
                cookingTime: '40 мин',
                difficulty: 'Средне',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Гречка с овощами',
                calories: 220,
                protein: 8,
                carbs: 42,
                fat: 3,
                category: 'Гарниры',
                description: 'Гречневая крупа с тушеными овощами (морковь, лук, перец).',
                recipeUrl: 'https://www.youtube.com/embed/example5',
                cookingTime: '25 мин',
                difficulty: 'Легко',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Протеиновый коктейль',
                calories: 180,
                protein: 25,
                carbs: 15,
                fat: 3,
                category: 'Напитки',
                description:
                    'Протеиновый порошок, банан, молоко и немного арахисовой пасты.',
                recipeUrl: 'https://www.youtube.com/embed/example6',
                cookingTime: '5 мин',
                difficulty: 'Легко',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Лосось на пару',
                calories: 280,
                protein: 25,
                carbs: 0,
                fat: 18,
                category: 'Основные блюда',
                description: 'Филе лосося, приготовленное на пару с лимоном и травами.',
                recipeUrl: 'https://www.youtube.com/embed/example7',
                cookingTime: '15 мин',
                difficulty: 'Легко',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Омлет с овощами',
                calories: 210,
                protein: 16,
                carbs: 8,
                fat: 12,
                category: 'Завтраки',
                description: 'Яичный омлет с помидорами, перцем и зеленью.',
                recipeUrl: 'https://www.youtube.com/embed/example8',
                cookingTime: '10 мин',
                difficulty: 'Легко',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Куриный суп',
                calories: 150,
                protein: 12,
                carbs: 18,
                fat: 4,
                category: 'Супы',
                description: 'Легкий куриный суп с овощами и вермишелью.',
                recipeUrl: 'https://www.youtube.com/embed/example9',
                cookingTime: '40 мин',
                difficulty: 'Средне',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Фруктовый салат',
                calories: 120,
                protein: 2,
                carbs: 28,
                fat: 1,
                category: 'Десерты',
                description: 'Смесь сезонных фруктов с натуральным йогуртом.',
                recipeUrl: 'https://www.youtube.com/embed/example10',
                cookingTime: '10 мин',
                difficulty: 'Легко',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Котлеты из индейки',
                calories: 190,
                protein: 20,
                carbs: 6,
                fat: 10,
                category: 'Основные блюда',
                description:
                    'Котлеты из фарша индейки с луком и специями, приготовленные в духовке.',
                recipeUrl: 'https://www.youtube.com/embed/example11',
                cookingTime: '30 мин',
                difficulty: 'Средне',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Рис с курицей',
                calories: 320,
                protein: 25,
                carbs: 45,
                fat: 6,
                category: 'Основные блюда',
                description: 'Отварной рис с тушеной куриной грудкой и овощами.',
                recipeUrl: 'https://www.youtube.com/embed/example12',
                cookingTime: '35 мин',
                difficulty: 'Средне',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Смузи с шпинатом',
                calories: 140,
                protein: 8,
                carbs: 25,
                fat: 2,
                category: 'Напитки',
                description: 'Шпинат, банан, яблоко и вода.',
                recipeUrl: 'https://www.youtube.com/embed/example13',
                cookingTime: '5 мин',
                difficulty: 'Легко',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Запеченные овощи',
                calories: 130,
                protein: 4,
                carbs: 22,
                fat: 4,
                category: 'Гарниры',
                description:
                    'Смесь овощей (брокколи, цветная капуста, морковь), запеченных в духовке.',
                recipeUrl: 'https://www.youtube.com/embed/example14',
                cookingTime: '25 мин',
                difficulty: 'Легко',
            },
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Творог с фруктами',
                calories: 180,
                protein: 20,
                carbs: 15,
                fat: 5,
                category: 'Завтраки',
                description: 'Обезжиренный творог с ягодами или фруктами.',
                recipeUrl: 'https://www.youtube.com/embed/example15',
                cookingTime: '2 мин',
                difficulty: 'Легко',
            },
        ];

        console.log('Начинаю добавление блюд в Firebase...');

        // Добавляем все блюда в Firebase
        for (const dish of mockDishes) {
            await addDoc(dishesRef, dish);
        }

        console.log(`Успешно добавлено ${mockDishes.length} блюд в Firebase`);
    } catch (error) {
        console.error('Ошибка при инициализации блюд:', error);
    }
};
