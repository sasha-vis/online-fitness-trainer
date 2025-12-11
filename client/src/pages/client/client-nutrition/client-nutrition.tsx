import { useState } from 'react';
import styles from './client-nutrition.module.scss';
import { Flex, Radio, RadioChangeEvent, Typography } from 'antd';

interface NutritionPlan {
    id: number;
    title: string;
    month: number;
    desc: '';
    plan: {
        date: number;
        day?: number;
        week?: number;
        meals: {
            index: number;
            title: string;
            time: string;
            dishes: {
                id: string;
                name: string;
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
                ingredients: {
                    name: string;
                    amount: number;
                    calories: number;
                }[];
            }[];
        }[];
    }[];
}

export const ClientNutrition = () => {
    const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');
    const data: NutritionPlan[] = mockData;

    const onFilterChange = (e: RadioChangeEvent) => {
        setFilter(e.target.value);
    };

    // Flatten all plans from all months into a single list
    const allEntries = data.flatMap((monthPlan) =>
        monthPlan.plan.map((entry) => ({
            ...entry,
            monthTitle: monthPlan.title,
            monthNumber: monthPlan.month,
        }))
    );

    // Group by day (date)
    const groupByDay = () => {
        const grouped: Record<number, (typeof allEntries)[0][]> = {};
        allEntries.forEach((entry) => {
            if (!grouped[entry.date]) grouped[entry.date] = [];
            grouped[entry.date].push(entry);
        });
        return Object.entries(grouped).map(([date, entries]) => ({
            date: parseInt(date),
            entries,
        }));
    };

    // Group by week
    const groupByWeek = () => {
        const grouped: Record<number, (typeof allEntries)[0][]> = {};
        allEntries.forEach((entry) => {
            const week = entry.week ?? Math.ceil(entry.date / 7); // fallback if week missing
            if (!grouped[week]) grouped[week] = [];
            grouped[week].push(entry);
        });
        return Object.entries(grouped).map(([week, entries]) => ({
            week: parseInt(week),
            entries,
        }));
    };

    // Group by month
    const groupByMonth = () => {
        return data.map((monthPlan) => ({
            month: monthPlan.month,
            title: monthPlan.title,
            entries: monthPlan.plan,
        }));
    };

    let content = null;

    if (filter === 'day') {
        const days = groupByDay();
        content = days.map(({ date, entries }) => (
            <div key={date} className={styles.group}>
                <Typography.Title level={4}>День {date}</Typography.Title>
                {entries.flatMap((entry) =>
                    entry.meals.map((meal) => <MealItem key={meal.index} meal={meal} />)
                )}
            </div>
        ));
    } else if (filter === 'week') {
        const weeks = groupByWeek();
        content = weeks.map(({ week, entries }) => (
            <div key={week} className={styles.group}>
                <Typography.Title level={4}>Неделя {week}</Typography.Title>
                {entries.flatMap((entry) =>
                    entry.meals.map((meal) => <MealItem key={meal.index} meal={meal} />)
                )}
            </div>
        ));
    } else if (filter === 'month') {
        const months = groupByMonth();
        content = months.map(({ month, title, entries }) => (
            <div key={month} className={styles.group}>
                <Typography.Title level={4}>
                    {title} (Месяц {month})
                </Typography.Title>
                {entries.flatMap((entry) =>
                    entry.meals.map((meal) => <MealItem key={meal.index} meal={meal} />)
                )}
            </div>
        ));
    }

    return (
        <Flex vertical align="center" className={styles.container}>
            <Typography.Title>План питания</Typography.Title>
            <Flex className={styles.filter}>
                <Radio.Group value={filter} onChange={onFilterChange}>
                    <Radio.Button value="day">На день</Radio.Button>
                    <Radio.Button value="week">На неделю</Radio.Button>
                    <Radio.Button value="month">На месяц</Radio.Button>
                </Radio.Group>
            </Flex>
            <Flex vertical className={styles.content}>
                {content}
            </Flex>
        </Flex>
    );
};

// Meal Item Component
const MealItem = ({ meal }: { meal: NutritionPlan['plan'][0]['meals'][0] }) => {
    return (
        <div className={styles.meal}>
            <Typography.Title level={5}>
                {meal.time} — {meal.title}
            </Typography.Title>
            <ul className={styles.dishes}>
                {meal.dishes.map((dish) => (
                    <li key={dish.id} className={styles.dish}>
                        <strong>{dish.name}</strong> ({dish.calories} ккал)
                        <br />
                        <small>
                            Б: {dish.protein}г | У: {dish.carbs}г | Ж: {dish.fat}г
                        </small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// === MOCK DATA (replace with real dataJson) ===
const mockData: NutritionPlan[] = [
    {
        id: 1,
        title: 'Январь',
        month: 1,
        desc: '',
        plan: [
            {
                date: 1,
                day: 1,
                week: 1,
                meals: [
                    {
                        index: 1,
                        title: 'Завтрак',
                        time: '08:00',
                        dishes: [
                            {
                                id: 'd1',
                                name: 'Овсянка с ягодами',
                                calories: 320,
                                protein: 10,
                                carbs: 55,
                                fat: 8,
                                ingredients: [
                                    { name: 'Овсянка', amount: 50, calories: 190 },
                                    { name: 'Молоко', amount: 100, calories: 60 },
                                    { name: 'Ягоды', amount: 30, calories: 70 },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                date: 2,
                day: 2,
                week: 1,
                meals: [
                    {
                        index: 2,
                        title: 'Обед',
                        time: '13:00',
                        dishes: [
                            {
                                id: 'd2',
                                name: 'Куриная грудка с гречкой',
                                calories: 450,
                                protein: 35,
                                carbs: 40,
                                fat: 12,
                                ingredients: [
                                    { name: 'Курица', amount: 150, calories: 250 },
                                    { name: 'Гречка', amount: 60, calories: 200 },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
