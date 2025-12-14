import {
    Button,
    Input,
    Select,
    Space,
    Modal,
    Form,
    message,
    Collapse,
    Tag,
    Spin,
    Card,
    Row,
    Col,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    PlusOutlined,
    InfoCircleOutlined,
    CaretRightOutlined,
    CalendarOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import { useState, useMemo, useEffect } from 'react';
import styles from './nutrition-templates.module.scss';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '@/firebase';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

interface Dish {
    id: string;
    name: string;
    category: string;
    description?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
}

interface MealDish {
    dishId: string;
    dishTitle: string;
    category: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    order: number;
}

interface Meal {
    id: string;
    name: string;
    description?: string;
    dishes: MealDish[];
    timeOfDay?: string;
}

interface Day {
    id: string;
    dayNumber: number;
    name: string;
    meals: Meal[];
}

interface NutritionPlanTemplate {
    id: string;
    name: string;
    description: string;
    durationDays: number;
    difficulty: 'Начинающий' | 'Средний' | 'Продвинутый';
    goal: string;
    days: Day[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Получение уникальных целей из планов
const getGoalsFromPlans = (plans: NutritionPlanTemplate[]) => {
    return Array.from(new Set(plans.map((plan) => plan.goal))).sort();
};

// Получение уникальных уровней сложности
const getDifficultiesFromPlans = (plans: NutritionPlanTemplate[]) => {
    return Array.from(new Set(plans.map((plan) => plan.difficulty))).sort();
};

// Компонент для управления блюдами в приеме пищи
const MealDishesForm = ({
    dayIndex,
    mealIndex,
    form,
    onOpenDishModal,
}: {
    dayIndex: number;
    mealIndex: number;
    form: any;
    allDishes: Dish[];
    onOpenDishModal: (dayIndex: number, mealIndex: number, form: any) => void;
}) => {
    // Используем Form.useWatch для отслеживания изменений блюд
    const dishes =
        Form.useWatch(['days', dayIndex, 'meals', mealIndex, 'dishes'], form) || [];

    const handleAddDish = () => {
        const newDish: MealDish = {
            dishId: `temp-${Date.now()}`,
            dishTitle: 'Новое блюдо',
            category: 'Основное',
            portion: '1 порция',
            calories: 300,
            protein: 20,
            carbs: 30,
            fat: 10,
            order: dishes.length,
        };

        const updatedDishes = [...dishes, newDish];

        // Получаем текущие значения формы
        const currentDays = form.getFieldValue('days') || [];
        const updatedDays = [...currentDays];

        if (!updatedDays[dayIndex]) {
            updatedDays[dayIndex] = { meals: [] };
        }
        if (!updatedDays[dayIndex].meals[mealIndex]) {
            updatedDays[dayIndex].meals[mealIndex] = {};
        }

        updatedDays[dayIndex].meals[mealIndex].dishes = updatedDishes;

        form.setFieldsValue({
            days: updatedDays,
        });
    };

    const handleRemoveDish = (dishIndex: number) => {
        const updatedDishes = dishes.filter((_: any, i: number) => i !== dishIndex);

        const currentDays = form.getFieldValue('days') || [];
        const updatedDays = [...currentDays];

        if (updatedDays[dayIndex] && updatedDays[dayIndex].meals[mealIndex]) {
            updatedDays[dayIndex].meals[mealIndex].dishes = updatedDishes;
        }

        form.setFieldsValue({
            days: updatedDays,
        });
    };

    const handleDishChange = (dishIndex: number, field: keyof MealDish, value: any) => {
        const updatedDishes = [...dishes];
        updatedDishes[dishIndex] = {
            ...updatedDishes[dishIndex],
            [field]: value,
        };

        const currentDays = form.getFieldValue('days') || [];
        const updatedDays = [...currentDays];

        if (updatedDays[dayIndex] && updatedDays[dayIndex].meals[mealIndex]) {
            updatedDays[dayIndex].meals[mealIndex].dishes = updatedDishes;
        }

        form.setFieldsValue({
            days: updatedDays,
        });
    };

    return (
        <div className={styles.dishesSection}>
            <div className={styles.dishesHeader}>
                <h5>Блюда</h5>
                <Space>
                    <Button
                        type="dashed"
                        size="small"
                        onClick={handleAddDish}
                        icon={<PlusCircleOutlined />}
                    >
                        Новое блюдо
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenDishModal(dayIndex, mealIndex, form);
                        }}
                        icon={<PlusOutlined />}
                    >
                        Выбрать из базы
                    </Button>
                </Space>
            </div>

            {dishes.length === 0 ? (
                <div className={styles.emptyDishes}>
                    <p>Блюда не добавлены</p>
                </div>
            ) : (
                <div className={styles.dishesList}>
                    {dishes.map((dish: MealDish, index: number) => (
                        <div key={index} className={styles.dishRow}>
                            <div className={styles.dishFields}>
                                <Input
                                    value={dish.dishTitle}
                                    onChange={(e) =>
                                        handleDishChange(
                                            index,
                                            'dishTitle',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Название блюда"
                                    style={{ flex: 2 }}
                                />
                                <Select
                                    value={dish.category}
                                    onChange={(value) =>
                                        handleDishChange(index, 'category', value)
                                    }
                                    style={{ flex: 1 }}
                                    placeholder="Категория"
                                >
                                    <Option value="Завтрак">Завтрак</Option>
                                    <Option value="Обед">Обед</Option>
                                    <Option value="Ужин">Ужин</Option>
                                    <Option value="Перекус">Перекус</Option>
                                    <Option value="Основное">Основное</Option>
                                    <Option value="Салат">Салат</Option>
                                    <Option value="Супы">Супы</Option>
                                    <Option value="Напитки">Напитки</Option>
                                    <Option value="Десерт">Десерт</Option>
                                </Select>
                                <Input
                                    value={dish.portion}
                                    onChange={(e) =>
                                        handleDishChange(index, 'portion', e.target.value)
                                    }
                                    placeholder="Порция"
                                    style={{ width: '120px' }}
                                />
                                <Input
                                    type="number"
                                    min={0}
                                    value={dish.calories}
                                    onChange={(e) =>
                                        handleDishChange(
                                            index,
                                            'calories',
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    placeholder="Ккал"
                                    style={{ width: '90px' }}
                                />
                            </div>
                            <Button
                                type="text"
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => handleRemoveDish(index)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const NutritionTemplates = () => {
    const [plans, setPlans] = useState<NutritionPlanTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [activeKeys, setActiveKeys] = useState<string[]>([]);
    const [goals, setGoals] = useState<string[]>([]);
    const [difficulties, setDifficulties] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [allDishes, setAllDishes] = useState<Dish[]>([]);
    const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
    const [currentMealContext, setCurrentMealContext] = useState<{
        dayIndex: number;
        mealIndex: number;
    } | null>(null);
    const [currentForm, setCurrentForm] = useState<any>(null);
    const [dishSearch, setDishSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<NutritionPlanTemplate | null>(null);
    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();

    // Загрузка шаблонов планов из Firebase
    const fetchPlans = async () => {
        try {
            setLoading(true);
            const plansRef = collection(db, 'nutritionPlanTemplates');
            const q = query(plansRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            const plansData: NutritionPlanTemplate[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                plansData.push({
                    id: doc.id,
                    name: data.name,
                    description: data.description,
                    durationDays: data.durationDays,
                    difficulty: data.difficulty,
                    goal: data.goal,
                    days: data.days || [],
                    createdAt: data.createdAt?.toDate(),
                    updatedAt: data.updatedAt?.toDate(),
                });
            });

            setPlans(plansData);
            setGoals(getGoalsFromPlans(plansData));
            setDifficulties(getDifficultiesFromPlans(plansData));
        } catch (error) {
            console.error('Ошибка при загрузке шаблонов планов питания:', error);
            message.error('Не удалось загрузить шаблоны планов питания');
        } finally {
            setLoading(false);
        }
    };

    // Загрузка всех блюд для выбора в планах
    const fetchDishes = async () => {
        try {
            const dishesRef = collection(db, 'meals');
            const q = query(dishesRef, orderBy('name')); // Изменил orderBy на 'name'
            const querySnapshot = await getDocs(q);

            const dishesData: Dish[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                dishesData.push({
                    id: doc.id,
                    name: data.name || '', // Изменил с dish.title на data.name
                    category: data.category || 'Основное',
                    description: data.description || '',
                    calories: data.calories || 0,
                    protein: data.protein || 0,
                    carbs: data.carbs || 0,
                    fat: data.fat || 0,
                });
            });
            setAllDishes(dishesData);
        } catch (error) {
            console.error('Ошибка при загрузке блюд:', error);
            message.error('Не удалось загрузить блюда');
        }
    };

    useEffect(() => {
        fetchPlans();
        fetchDishes();
    }, []);

    // Фильтрация блюд для модалки добавления
    const filteredDishes = useMemo(() => {
        return allDishes.filter((dish) => {
            const matchesSearch =
                dishSearch === '' ||
                dish.name.toLowerCase().includes(dishSearch.toLowerCase()) || // Изменил с dish.title
                dish.category.toLowerCase().includes(dishSearch.toLowerCase());

            const matchesCategory =
                selectedCategory === null || dish.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [allDishes, dishSearch, selectedCategory]);

    // Получение уникальных категорий
    const categories = useMemo(() => {
        return Array.from(new Set(allDishes.map((dish) => dish.category))).sort();
    }, [allDishes]);

    // Фильтрация планов
    const filteredPlans = useMemo(() => {
        return plans.filter((plan) => {
            const matchesSearch =
                searchText === '' ||
                plan.name.toLowerCase().includes(searchText.toLowerCase()) ||
                plan.description.toLowerCase().includes(searchText.toLowerCase());

            const matchesGoal = selectedGoal === null || plan.goal === selectedGoal;
            const matchesDifficulty =
                selectedDifficulty === null || plan.difficulty === selectedDifficulty;

            return matchesSearch && matchesGoal && matchesDifficulty;
        });
    }, [plans, searchText, selectedGoal, selectedDifficulty]);

    // Обработчик аккордеона
    const handleAccordionChange = (keys: string | string[]) => {
        setActiveKeys(Array.isArray(keys) ? keys : [keys]);
    };

    // Открытие модалки добавления блюд для формы
    const handleOpenDishModal = (dayIndex: number, mealIndex: number, form: any) => {
        setCurrentMealContext({ dayIndex, mealIndex });
        setCurrentForm(form);
        setIsAddDishModalOpen(true);
    };

    // Добавление блюда из базы данных в форму
    const handleAddDishFromDB = (dish: Dish) => {
        if (!currentMealContext || !currentForm) return;

        const { dayIndex, mealIndex } = currentMealContext;

        // Получаем текущие значения формы
        const currentDays = currentForm.getFieldValue('days') || [];
        const updatedDays = [...currentDays];

        // Создаем структуру если ее нет
        if (!updatedDays[dayIndex]) {
            updatedDays[dayIndex] = { meals: [] };
        }
        if (!updatedDays[dayIndex].meals[mealIndex]) {
            updatedDays[dayIndex].meals[mealIndex] = { dishes: [] };
        }

        // Получаем текущие блюда
        const currentDishes = updatedDays[dayIndex].meals[mealIndex].dishes || [];

        // Проверяем, не добавлено ли уже это блюдо
        if (currentDishes.some((d: MealDish) => d.dishId === dish.id)) {
            message.warning('Это блюдо уже добавлено в прием пищи');
            return;
        }

        // Создаем новое блюдо для приема пищи
        const newDish: MealDish = {
            dishId: dish.id,
            dishTitle: dish.name, // Изменил с dish.title
            category: dish.category || 'Основное',
            portion: '1 порция',
            calories: dish.calories || 0,
            protein: dish.protein || 0,
            carbs: dish.carbs || 0,
            fat: dish.fat || 0,
            order: currentDishes.length,
        };

        // Добавляем блюдо
        updatedDays[dayIndex].meals[mealIndex].dishes = [...currentDishes, newDish];

        // Обновляем форму
        currentForm.setFieldsValue({
            days: updatedDays,
        });

        message.success('Блюдо добавлено в прием пищи');
        handleCloseDishModal();
    };

    // Обновление плана в Firebase
    const updatePlanInFirebase = async (planId: string, data: any) => {
        try {
            const planRef = doc(db, 'nutritionPlanTemplates', planId);

            // Очищаем данные перед отправкой
            const cleanData = {
                ...data,
                days: data.days || [],
                updatedAt: new Date(),
            };

            await updateDoc(planRef, cleanData);
            return true;
        } catch (error) {
            console.error('Ошибка при обновлении плана питания:', error);
            console.error('Данные для обновления:', data);
            throw error;
        }
    };

    // Модалки
    const showCreateModal = () => {
        createForm.resetFields();
        createForm.setFieldsValue({
            name: '',
            description: '',
            durationDays: 7,
            difficulty: 'Начинающий',
            goal: 'Похудение',
            days: [
                {
                    dayNumber: 1,
                    name: 'День 1',
                    meals: [],
                },
            ],
        });
        setIsCreateModalOpen(true);
    };

    const showEditModal = (plan: NutritionPlanTemplate) => {
        setCurrentPlan(plan);

        // Преобразуем данные для формы
        const formData = {
            name: plan.name,
            description: plan.description,
            durationDays: plan.durationDays,
            difficulty: plan.difficulty,
            goal: plan.goal,
            days:
                plan.days.length > 0
                    ? plan.days
                    : [
                          {
                              dayNumber: 1,
                              name: 'День 1',
                              meals: [],
                          },
                      ],
        };

        editForm.setFieldsValue(formData);
        setIsEditModalOpen(true);
    };

    const showDeleteModal = (plan: NutritionPlanTemplate) => {
        setCurrentPlan(plan);
        setIsDeleteModalOpen(true);
    };

    const handleCancelCreate = () => {
        setIsCreateModalOpen(false);
        createForm.resetFields();
        setSubmitting(false);
    };

    const handleCancelEdit = () => {
        setIsEditModalOpen(false);
        editForm.resetFields();
        setSubmitting(false);
        setCurrentPlan(null);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setCurrentPlan(null);
    };

    const handleCloseDishModal = () => {
        setIsAddDishModalOpen(false);
        setCurrentMealContext(null);
        setCurrentForm(null);
        setDishSearch('');
        setSelectedCategory(null);
    };

    // Создание плана
    const handleCreate = async (values: any) => {
        try {
            if (!values.name?.trim()) {
                message.error('Введите название шаблона');
                return;
            }

            if (!values.description?.trim()) {
                message.error('Введите описание шаблона');
                return;
            }

            if (!values.goal?.trim()) {
                message.error('Введите цель плана');
                return;
            }
            setSubmitting(true);
            const plansRef = collection(db, 'nutritionPlanTemplates');

            // Очищаем данные от undefined и пустых значений
            const cleanDays = (values.days || []).map((day: any) => ({
                dayNumber: Number(day.dayNumber) || 1,
                name: day.name?.trim() || `День ${day.dayNumber}`,
                meals: (day.meals || []).map((meal: any) => ({
                    id: meal.id || `meal-${Date.now()}`,
                    name: meal.name?.trim() || 'Новый прием пищи',
                    description: meal.description?.trim() || '',
                    timeOfDay:
                        meal.timeOfDay !== undefined && meal.timeOfDay !== null
                            ? String(meal.timeOfDay)
                            : null,
                    dishes: (meal.dishes || []).map((dish: any, index: number) => ({
                        dishId: dish.dishId || `dish-${Date.now()}-${index}`,
                        dishTitle: dish.dishTitle?.trim() || 'Новое блюдо',
                        category: dish.category?.trim() || 'Основное',
                        portion: dish.portion?.trim() || '1 порция',
                        calories: Number(dish.calories) || 0,
                        protein: Number(dish.protein) || 0,
                        carbs: Number(dish.carbs) || 0,
                        fat: Number(dish.fat) || 0,
                        order: index,
                    })),
                })),
            }));

            const newPlanData = {
                name: values.name?.trim() || 'Новый план питания',
                description: values.description?.trim() || 'Описание плана питания',
                durationDays: Number(values.durationDays) || 7,
                difficulty: values.difficulty || 'Начинающий',
                goal: values.goal?.trim() || 'Похудение',
                days: cleanDays,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const docRef = await addDoc(plansRef, newPlanData);

            const createdPlan: NutritionPlanTemplate = {
                id: docRef.id,
                ...newPlanData,
            };

            setPlans((prev) => [createdPlan, ...prev]);
            setGoals(getGoalsFromPlans([createdPlan, ...plans]));
            setDifficulties(getDifficultiesFromPlans([createdPlan, ...plans]));

            message.success('Шаблон плана питания создан!');
            handleCancelCreate();
        } catch (error) {
            console.error('Ошибка при создании шаблона плана питания:', error);
            message.error('Не удалось создать шаблон плана питания');
        } finally {
            setSubmitting(false);
        }
    };

    // Редактирование плана
    const handleEdit = async (values: any) => {
        if (!currentPlan) return;

        try {
            setSubmitting(true);

            // Очищаем данные от undefined и пустых значений
            const cleanDays = (values.days || []).map((day: any) => ({
                dayNumber: Number(day.dayNumber) || 1,
                name: day.name?.trim() || `День ${day.dayNumber}`,
                meals: (day.meals || []).map((meal: any) => ({
                    id: meal.id || `meal-${Date.now()}`,
                    name: meal.name?.trim() || 'Новый прием пищи',
                    description: meal.description?.trim() || '',
                    timeOfDay:
                        meal.timeOfDay !== undefined && meal.timeOfDay !== null
                            ? String(meal.timeOfDay)
                            : null,
                    dishes: (meal.dishes || []).map((dish: any, index: number) => ({
                        dishId: dish.dishId || `dish-${Date.now()}-${index}`,
                        dishTitle: dish.dishTitle?.trim() || 'Новое блюдо',
                        category: dish.category?.trim() || 'Основное',
                        portion: dish.portion?.trim() || '1 порция',
                        calories: Number(dish.calories) || 0,
                        protein: Number(dish.protein) || 0,
                        carbs: Number(dish.carbs) || 0,
                        fat: Number(dish.fat) || 0,
                        order: index,
                    })),
                })),
            }));

            const updatedData = {
                name: values.name?.trim() || 'Новый план питания',
                description: values.description?.trim() || 'Описание плана питания',
                durationDays: Number(values.durationDays) || 7,
                difficulty: values.difficulty || 'Начинающий',
                goal: values.goal?.trim() || 'Похудение',
                days: cleanDays,
                updatedAt: new Date(),
            };

            await updatePlanInFirebase(currentPlan.id, updatedData);

            setPlans((prev) =>
                prev.map((plan) =>
                    plan.id === currentPlan.id ? { ...plan, ...updatedData } : plan
                )
            );

            setGoals(
                getGoalsFromPlans(
                    plans.map((plan) =>
                        plan.id === currentPlan.id ? { ...plan, ...updatedData } : plan
                    )
                )
            );

            setDifficulties(
                getDifficultiesFromPlans(
                    plans.map((plan) =>
                        plan.id === currentPlan.id ? { ...plan, ...updatedData } : plan
                    )
                )
            );

            message.success('Шаблон плана питания обновлен!');
            handleCancelEdit();
        } catch (error) {
            console.error('Ошибка при обновлении шаблона плана питания:', error);
            message.error('Не удалось обновить шаблон плана питания');
        } finally {
            setSubmitting(false);
        }
    };

    // Удаление плана
    const handleDelete = async () => {
        if (!currentPlan) return;

        try {
            setSubmitting(true);
            const planRef = doc(db, 'nutritionPlanTemplates', currentPlan.id);
            await deleteDoc(planRef);

            setPlans((prev) => prev.filter((plan) => plan.id !== currentPlan.id));
            setGoals(
                getGoalsFromPlans(plans.filter((plan) => plan.id !== currentPlan.id))
            );
            setDifficulties(
                getDifficultiesFromPlans(
                    plans.filter((plan) => plan.id !== currentPlan.id)
                )
            );

            message.success('Шаблон плана питания удален!');
            handleCancelDelete();
        } catch (error) {
            console.error('Ошибка при удалении шаблона плана питания:', error);
            message.error('Не удалось удалить шаблон плана питания');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetFilters = () => {
        setSearchText('');
        setSelectedGoal(null);
        setSelectedDifficulty(null);
    };

    // Вспомогательные функции для времени дня
    const getTimeOfDayName = (time: string) => {
        const times: Record<string, string> = {
            morning: 'Утро',
            breakfast: 'Завтрак',
            lunch: 'Обед',
            dinner: 'Ужин',
            snack: 'Перекус',
            evening: 'Вечер',
        };
        return times[time] || time;
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" />
                <p>Загрузка шаблонов планов питания...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Шаблоны планов питания</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                    disabled={loading}
                >
                    Создать шаблон
                </Button>
            </div>

            {/* Фильтры */}
            <div className={styles.filters}>
                <Space size="middle" wrap>
                    <div className={styles.filterItem}>
                        <span className={styles.filterLabel}>Поиск:</span>
                        <Input
                            placeholder="Поиск по названию или описанию..."
                            allowClear
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            prefix={<SearchOutlined />}
                            style={{ width: 300 }}
                        />
                    </div>

                    <div className={styles.filterItem}>
                        <span className={styles.filterLabel}>Цель:</span>
                        <Select
                            placeholder="Все цели"
                            style={{ width: 180 }}
                            allowClear
                            value={selectedGoal}
                            onChange={setSelectedGoal}
                        >
                            {goals.map((goal) => (
                                <Option key={goal} value={goal}>
                                    {goal}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <div className={styles.filterItem}>
                        <span className={styles.filterLabel}>Сложность:</span>
                        <Select
                            placeholder="Все уровни"
                            style={{ width: 150 }}
                            allowClear
                            value={selectedDifficulty}
                            onChange={setSelectedDifficulty}
                        >
                            {difficulties.map((difficulty) => (
                                <Option key={difficulty} value={difficulty}>
                                    {difficulty}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <Button
                        onClick={handleResetFilters}
                        disabled={!searchText && !selectedGoal && !selectedDifficulty}
                    >
                        Сбросить фильтры
                    </Button>
                </Space>

                <div className={styles.filterStats}>
                    Найдено шаблонов: {filteredPlans.length}
                    {selectedGoal && (
                        <span className={styles.activeFilter}>
                            • Цель: {selectedGoal}
                        </span>
                    )}
                    {selectedDifficulty && (
                        <span className={styles.activeFilter}>
                            • Сложность: {selectedDifficulty}
                        </span>
                    )}
                </div>
            </div>

            {/* Аккордеон со списком шаблонов */}
            <div className={styles.accordionContainer}>
                {filteredPlans.length > 0 ? (
                    <Collapse
                        activeKey={activeKeys}
                        onChange={handleAccordionChange}
                        expandIcon={({ isActive }) => (
                            <CaretRightOutlined rotate={isActive ? 90 : 0} />
                        )}
                        className={styles.plansAccordion}
                    >
                        {filteredPlans.map((plan) => (
                            <Panel
                                key={plan.id}
                                header={
                                    <div className={styles.panelHeader}>
                                        <div className={styles.planHeader}>
                                            <div className={styles.planTitle}>
                                                {plan.name}
                                            </div>
                                            <div className={styles.planTags}>
                                                <Tag
                                                    color={
                                                        plan.difficulty === 'Начинающий'
                                                            ? 'green'
                                                            : plan.difficulty ===
                                                                'Средний'
                                                              ? 'orange'
                                                              : 'red'
                                                    }
                                                    className={styles.difficultyTag}
                                                >
                                                    {plan.difficulty}
                                                </Tag>
                                                <Tag
                                                    color="blue"
                                                    className={styles.goalTag}
                                                >
                                                    {plan.goal}
                                                </Tag>
                                                <div className={styles.planDuration}>
                                                    <CalendarOutlined />{' '}
                                                    {plan.durationDays} дней
                                                </div>
                                                {plan.days && plan.days.length > 0 && (
                                                    <div className={styles.planDays}>
                                                        {plan.days.length} дней
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.planActions}>
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                type="text"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showEditModal(plan);
                                                }}
                                            />
                                            <Button
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                type="text"
                                                danger
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showDeleteModal(plan);
                                                }}
                                            />
                                        </div>
                                    </div>
                                }
                                className={styles.planPanel}
                            >
                                <div className={styles.panelContent}>
                                    {/* Описание */}
                                    <div className={styles.descriptionSection}>
                                        <h4 className={styles.sectionTitle}>
                                            <InfoCircleOutlined /> Описание шаблона
                                        </h4>
                                        <p className={styles.planDescription}>
                                            {plan.description}
                                        </p>
                                    </div>

                                    {/* Детали плана */}
                                    <div className={styles.planDetails}>
                                        <Row gutter={[16, 16]}>
                                            <Col span={8}>
                                                <Card
                                                    size="small"
                                                    title="Продолжительность"
                                                >
                                                    <div className={styles.detailValue}>
                                                        {plan.durationDays} дней
                                                    </div>
                                                </Card>
                                            </Col>
                                            <Col span={8}>
                                                <Card
                                                    size="small"
                                                    title="Уровень сложности"
                                                >
                                                    <div className={styles.detailValue}>
                                                        {plan.difficulty}
                                                    </div>
                                                </Card>
                                            </Col>
                                            <Col span={8}>
                                                <Card size="small" title="Основная цель">
                                                    <div className={styles.detailValue}>
                                                        {plan.goal}
                                                    </div>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </div>

                                    {/* Дни питания */}
                                    {plan.days && plan.days.length > 0 ? (
                                        <div className={styles.daysSection}>
                                            <h4 className={styles.sectionTitle}>
                                                <CalendarOutlined /> Структура плана
                                            </h4>
                                            <Collapse className={styles.daysAccordion}>
                                                {plan.days.map((day, dayIndex) => (
                                                    <Panel
                                                        header={`День ${day.dayNumber}: ${day.name || `День ${day.dayNumber}`}`}
                                                        key={day.id || dayIndex}
                                                    >
                                                        {day.meals &&
                                                        day.meals.length > 0 ? (
                                                            <div
                                                                className={
                                                                    styles.mealsList
                                                                }
                                                            >
                                                                {day.meals.map(
                                                                    (meal, mealIndex) => (
                                                                        <Card
                                                                            key={
                                                                                meal.id ||
                                                                                mealIndex
                                                                            }
                                                                            size="small"
                                                                            title={`${meal.name} ${meal.timeOfDay ? `(${getTimeOfDayName(meal.timeOfDay)})` : ''}`}
                                                                            className={
                                                                                styles.mealCard
                                                                            }
                                                                        >
                                                                            {meal.description && (
                                                                                <p>
                                                                                    {
                                                                                        meal.description
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                            {meal.dishes &&
                                                                            meal.dishes
                                                                                .length >
                                                                                0 ? (
                                                                                <div
                                                                                    className={
                                                                                        styles.dishesList
                                                                                    }
                                                                                >
                                                                                    <h5>
                                                                                        Блюда:
                                                                                    </h5>
                                                                                    {meal.dishes.map(
                                                                                        (
                                                                                            dish,
                                                                                            dishIndex
                                                                                        ) => (
                                                                                            <div
                                                                                                key={
                                                                                                    dishIndex
                                                                                                }
                                                                                                className={
                                                                                                    styles.dishItem
                                                                                                }
                                                                                            >
                                                                                                <div
                                                                                                    className={
                                                                                                        styles.dishInfo
                                                                                                    }
                                                                                                >
                                                                                                    <div
                                                                                                        className={
                                                                                                            styles.dishTitleRow
                                                                                                        }
                                                                                                    >
                                                                                                        <strong>
                                                                                                            {
                                                                                                                dish.dishTitle
                                                                                                            }
                                                                                                        </strong>
                                                                                                        <Tag
                                                                                                            color="blue"
                                                                                                            className={
                                                                                                                styles.smallTag
                                                                                                            }
                                                                                                        >
                                                                                                            {
                                                                                                                dish.category
                                                                                                            }
                                                                                                        </Tag>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className={
                                                                                                            styles.dishParams
                                                                                                        }
                                                                                                    >
                                                                                                        <div
                                                                                                            className={
                                                                                                                styles.paramItem
                                                                                                            }
                                                                                                        >
                                                                                                            <span
                                                                                                                className={
                                                                                                                    styles.paramLabel
                                                                                                                }
                                                                                                            >
                                                                                                                Порция:
                                                                                                            </span>
                                                                                                            <span>
                                                                                                                {
                                                                                                                    dish.portion
                                                                                                                }
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className={
                                                                                                                styles.paramItem
                                                                                                            }
                                                                                                        >
                                                                                                            <span
                                                                                                                className={
                                                                                                                    styles.paramLabel
                                                                                                                }
                                                                                                            >
                                                                                                                Ккал:
                                                                                                            </span>
                                                                                                            <span>
                                                                                                                {
                                                                                                                    dish.calories
                                                                                                                }
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className={
                                                                                                                styles.paramItem
                                                                                                            }
                                                                                                        >
                                                                                                            <span
                                                                                                                className={
                                                                                                                    styles.paramLabel
                                                                                                                }
                                                                                                            >
                                                                                                                Белки:
                                                                                                            </span>
                                                                                                            <span>
                                                                                                                {
                                                                                                                    dish.protein
                                                                                                                }

                                                                                                                г
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className={
                                                                                                                styles.paramItem
                                                                                                            }
                                                                                                        >
                                                                                                            <span
                                                                                                                className={
                                                                                                                    styles.paramLabel
                                                                                                                }
                                                                                                            >
                                                                                                                Углеводы:
                                                                                                            </span>
                                                                                                            <span>
                                                                                                                {
                                                                                                                    dish.carbs
                                                                                                                }

                                                                                                                г
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className={
                                                                                                                styles.paramItem
                                                                                                            }
                                                                                                        >
                                                                                                            <span
                                                                                                                className={
                                                                                                                    styles.paramLabel
                                                                                                                }
                                                                                                            >
                                                                                                                Жиры:
                                                                                                            </span>
                                                                                                            <span>
                                                                                                                {
                                                                                                                    dish.fat
                                                                                                                }

                                                                                                                г
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            ) : (
                                                                                <div
                                                                                    className={
                                                                                        styles.emptyDishes
                                                                                    }
                                                                                >
                                                                                    <p
                                                                                        className={
                                                                                            styles.emptyText
                                                                                        }
                                                                                    >
                                                                                        Блюда
                                                                                        не
                                                                                        добавлены
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        </Card>
                                                                    )
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className={
                                                                    styles.emptyMeals
                                                                }
                                                            >
                                                                <p
                                                                    className={
                                                                        styles.emptyText
                                                                    }
                                                                >
                                                                    Приемы пищи не
                                                                    добавлены для этого
                                                                    дня
                                                                </p>
                                                            </div>
                                                        )}
                                                    </Panel>
                                                ))}
                                            </Collapse>
                                        </div>
                                    ) : (
                                        <div className={styles.emptySection}>
                                            <p className={styles.emptyText}>
                                                Дни питания не добавлены
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Panel>
                        ))}
                    </Collapse>
                ) : (
                    <div className={styles.noResults}>
                        <p>По вашему запросу ничего не найдено</p>
                        <Button onClick={handleResetFilters}>Показать все шаблоны</Button>
                    </div>
                )}
            </div>

            {/* Модалка создания шаблона */}
            <Modal
                title="Создать новый шаблон плана питания"
                open={isCreateModalOpen}
                onCancel={handleCancelCreate}
                footer={[
                    <Button key="cancel" onClick={handleCancelCreate}>
                        Отмена
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => createForm.submit()}
                        loading={submitting}
                    >
                        Создать
                    </Button>,
                ]}
                width={800}
                style={{ maxHeight: '80vh', overflow: 'auto' }}
            >
                <Form form={createForm} layout="vertical" onFinish={handleCreate}>
                    <Form.Item
                        name="name"
                        label="Название шаблона"
                        rules={[
                            { required: true, message: 'Введите название шаблона' },
                            {
                                min: 3,
                                message: 'Название должно быть не менее 3 символов',
                            },
                        ]}
                    >
                        <Input placeholder="Например: План для похудения" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Описание шаблона"
                        rules={[
                            { required: true, message: 'Введите описание шаблона' },
                            {
                                min: 10,
                                message: 'Описание должно быть не менее 10 символов',
                            },
                        ]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Опишите цели и особенности плана питания..."
                        />
                    </Form.Item>
                    <div className={styles.formRow}>
                        <Form.Item
                            name="durationDays"
                            label="Продолжительность (дней)"
                            normalize={(value) => Number(value)}
                            rules={[
                                { required: true, message: 'Введите продолжительность' },
                                {
                                    type: 'number',
                                    min: 1,
                                    max: 365,
                                    message: 'От 1 до 365 дней',
                                },
                            ]}
                            className={styles.formThird}
                        >
                            <Input type="number" min={1} max={365} />
                        </Form.Item>

                        <Form.Item
                            name="difficulty"
                            label="Уровень сложности"
                            rules={[
                                { required: true, message: 'Выберите уровень сложности' },
                            ]}
                            className={styles.formThird}
                        >
                            <Select placeholder="Выберите уровень">
                                <Option value="Начинающий">Начинающий</Option>
                                <Option value="Средний">Средний</Option>
                                <Option value="Продвинутый">Продвинутый</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="goal"
                            label="Цель плана"
                            rules={[{ required: true, message: 'Введите цель плана' }]}
                            className={styles.formThird}
                        >
                            <Input placeholder="Например: Похудение, Набор массы, Поддержание" />
                        </Form.Item>
                    </div>
                    {/* Динамическая форма для дней */}
                    <Form.List name="days">
                        {(fields, { add, remove }) => (
                            <>
                                <div className={styles.formSectionHeader}>
                                    <h4>Дни питания</h4>
                                    <Button
                                        type="dashed"
                                        onClick={() =>
                                            add({
                                                dayNumber: fields.length + 1,
                                                name: `День ${fields.length + 1}`,
                                                meals: [],
                                            })
                                        }
                                        icon={<PlusCircleOutlined />}
                                    >
                                        Добавить день
                                    </Button>
                                </div>

                                {fields.length === 0 && (
                                    <p className={styles.emptyText}>
                                        Добавьте хотя бы один день питания
                                    </p>
                                )}

                                {fields.map((field, dayIndex) => (
                                    <Card
                                        key={field.key}
                                        title={`День ${dayIndex + 1}`}
                                        size="small"
                                        className={styles.dayCard}
                                        extra={
                                            fields.length > 1 && (
                                                <MinusCircleOutlined
                                                    onClick={() => remove(field.name)}
                                                    style={{ color: '#ff4d4f' }}
                                                />
                                            )
                                        }
                                    >
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'dayNumber']}
                                            fieldKey={[field.key, 'dayNumber']}
                                            hidden
                                        >
                                            <Input type="hidden" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Название дня (опционально)"
                                            name={[field.name, 'name']}
                                            fieldKey={[field.key, 'name']}
                                        >
                                            <Input
                                                placeholder={`День ${dayIndex + 1}: Название`}
                                            />
                                        </Form.Item>

                                        {/* Приемы пищи для дня */}
                                        <Form.List name={[field.name, 'meals']}>
                                            {(
                                                mealFields,
                                                { add: addMeal, remove: removeMeal }
                                            ) => (
                                                <>
                                                    <div
                                                        className={
                                                            styles.subSectionHeader
                                                        }
                                                    >
                                                        <h5>Приемы пищи дня</h5>
                                                        <Button
                                                            type="dashed"
                                                            size="small"
                                                            onClick={() =>
                                                                addMeal({
                                                                    id: `meal-${Date.now()}`,
                                                                    name: `Прием пищи ${mealFields.length + 1}`,
                                                                    dishes: [],
                                                                })
                                                            }
                                                            icon={<PlusCircleOutlined />}
                                                            disabled={
                                                                mealFields.length >= 6
                                                            }
                                                        >
                                                            Добавить прием пищи
                                                        </Button>
                                                        {mealFields.length >= 6 && (
                                                            <span
                                                                className={
                                                                    styles.limitText
                                                                }
                                                            >
                                                                Максимум 6 приемов пищи в
                                                                день
                                                            </span>
                                                        )}
                                                    </div>

                                                    {mealFields.map(
                                                        (mealField, mealIndex) => (
                                                            <Card
                                                                key={mealField.key}
                                                                size="small"
                                                                title={`Прием пищи ${mealIndex + 1}`}
                                                                className={
                                                                    styles.mealFormCard
                                                                }
                                                                extra={
                                                                    <MinusCircleOutlined
                                                                        onClick={() =>
                                                                            removeMeal(
                                                                                mealField.name
                                                                            )
                                                                        }
                                                                        style={{
                                                                            color: '#ff4d4f',
                                                                        }}
                                                                    />
                                                                }
                                                            >
                                                                <Form.Item
                                                                    {...mealField}
                                                                    label="Название приема пищи"
                                                                    name={[
                                                                        mealField.name,
                                                                        'name',
                                                                    ]}
                                                                    fieldKey={[
                                                                        mealField.key,
                                                                        'name',
                                                                    ]}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message:
                                                                                'Введите название приема пищи',
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input placeholder="Например: Завтрак, Обед, Ужин" />
                                                                </Form.Item>

                                                                <Form.Item
                                                                    label="Описание (опционально)"
                                                                    name={[
                                                                        mealField.name,
                                                                        'description',
                                                                    ]}
                                                                    fieldKey={[
                                                                        mealField.key,
                                                                        'description',
                                                                    ]}
                                                                >
                                                                    <TextArea
                                                                        rows={2}
                                                                        placeholder="Описание приема пищи..."
                                                                    />
                                                                </Form.Item>

                                                                <Form.Item
                                                                    label="Время дня (опционально)"
                                                                    name={[
                                                                        mealField.name,
                                                                        'timeOfDay',
                                                                    ]}
                                                                    fieldKey={[
                                                                        mealField.key,
                                                                        'timeOfDay',
                                                                    ]}
                                                                >
                                                                    <Select placeholder="Выберите время">
                                                                        <Option value="morning">
                                                                            Утро
                                                                        </Option>
                                                                        <Option value="breakfast">
                                                                            Завтрак
                                                                        </Option>
                                                                        <Option value="lunch">
                                                                            Обед
                                                                        </Option>
                                                                        <Option value="dinner">
                                                                            Ужин
                                                                        </Option>
                                                                        <Option value="snack">
                                                                            Перекус
                                                                        </Option>
                                                                        <Option value="evening">
                                                                            Вечер
                                                                        </Option>
                                                                    </Select>
                                                                </Form.Item>

                                                                {/* Форма для блюд приема пищи */}
                                                                <MealDishesForm
                                                                    dayIndex={dayIndex}
                                                                    mealIndex={mealIndex}
                                                                    form={createForm}
                                                                    allDishes={allDishes}
                                                                    onOpenDishModal={
                                                                        handleOpenDishModal
                                                                    }
                                                                />
                                                            </Card>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </Form.List>
                                    </Card>
                                ))}
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>

            {/* Модалка редактирования шаблона */}
            <Modal
                title="Редактировать шаблон плана питания"
                open={isEditModalOpen}
                onCancel={handleCancelEdit}
                footer={[
                    <Button key="cancel" onClick={handleCancelEdit}>
                        Отмена
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => editForm.submit()}
                        loading={submitting}
                    >
                        Сохранить
                    </Button>,
                ]}
                width={800}
                style={{ maxHeight: '80vh', overflow: 'auto' }}
            >
                {currentPlan && (
                    <Form form={editForm} layout="vertical" onFinish={handleEdit}>
                        <Form.Item
                            name="name"
                            label="Название шаблона"
                            rules={[
                                { required: true, message: 'Введите название шаблона' },
                                {
                                    min: 3,
                                    message: 'Название должно быть не менее 3 символов',
                                },
                            ]}
                        >
                            <Input placeholder="Например: План для похудения" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Описание шаблона"
                            rules={[
                                { required: true, message: 'Введите описание шаблона' },
                                {
                                    min: 10,
                                    message: 'Описание должно быть не менее 10 символов',
                                },
                            ]}
                        >
                            <TextArea
                                rows={3}
                                placeholder="Опишите цели и особенности плана питания..."
                            />
                        </Form.Item>
                        <div className={styles.formRow}>
                            <Form.Item
                                name="durationDays"
                                label="Продолжительность (дней)"
                                normalize={(value) => Number(value)}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Введите продолжительность',
                                    },
                                    {
                                        type: 'number',
                                        min: 1,
                                        max: 365,
                                        message: 'От 1 до 365 дней',
                                    },
                                ]}
                                className={styles.formThird}
                            >
                                <Input type="number" min={1} max={365} />
                            </Form.Item>

                            <Form.Item
                                name="difficulty"
                                label="Уровень сложности"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Выберите уровень сложности',
                                    },
                                ]}
                                className={styles.formThird}
                            >
                                <Select>
                                    <Option value="Начинающий">Начинающий</Option>
                                    <Option value="Средний">Средний</Option>
                                    <Option value="Продвинутый">Продвинутый</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="goal"
                                label="Цель плана"
                                rules={[
                                    { required: true, message: 'Введите цель плана' },
                                ]}
                                className={styles.formThird}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                        {/* Редактирование дней */}
                        <Form.List name="days">
                            {(fields, { add, remove }) => (
                                <>
                                    <div className={styles.formSectionHeader}>
                                        <h4>Дни питания</h4>
                                        <Button
                                            type="dashed"
                                            onClick={() =>
                                                add({
                                                    dayNumber: fields.length + 1,
                                                    name: `День ${fields.length + 1}`,
                                                    meals: [],
                                                })
                                            }
                                            icon={<PlusCircleOutlined />}
                                        >
                                            Добавить день
                                        </Button>
                                    </div>

                                    {fields.map((field, dayIndex) => (
                                        <Card
                                            key={field.key}
                                            title={`День ${dayIndex + 1}`}
                                            size="small"
                                            className={styles.dayCard}
                                            extra={
                                                <MinusCircleOutlined
                                                    onClick={() => remove(field.name)}
                                                    style={{ color: '#ff4d4f' }}
                                                />
                                            }
                                        >
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'dayNumber']}
                                                fieldKey={[field.key, 'dayNumber']}
                                                hidden
                                            >
                                                <Input type="hidden" />
                                            </Form.Item>

                                            <Form.Item
                                                label="Название дня (опционально)"
                                                name={[field.name, 'name']}
                                                fieldKey={[field.key, 'name']}
                                            >
                                                <Input />
                                            </Form.Item>

                                            {/* Приемы пищи для дня */}
                                            <Form.List name={[field.name, 'meals']}>
                                                {(
                                                    mealFields,
                                                    { add: addMeal, remove: removeMeal }
                                                ) => (
                                                    <>
                                                        <div
                                                            className={
                                                                styles.subSectionHeader
                                                            }
                                                        >
                                                            <h5>Приемы пищи дня</h5>
                                                            <Button
                                                                type="dashed"
                                                                size="small"
                                                                onClick={() =>
                                                                    addMeal({
                                                                        id: `meal-${Date.now()}`,
                                                                        name: `Прием пищи ${mealFields.length + 1}`,
                                                                        dishes: [],
                                                                    })
                                                                }
                                                                icon={
                                                                    <PlusCircleOutlined />
                                                                }
                                                                disabled={
                                                                    mealFields.length >= 6
                                                                }
                                                            >
                                                                Добавить прием пищи
                                                            </Button>
                                                        </div>

                                                        {mealFields.map(
                                                            (mealField, mealIndex) => (
                                                                <Card
                                                                    key={mealField.key}
                                                                    size="small"
                                                                    title={`Прием пищи ${mealIndex + 1}`}
                                                                    className={
                                                                        styles.mealFormCard
                                                                    }
                                                                    extra={
                                                                        <MinusCircleOutlined
                                                                            onClick={() =>
                                                                                removeMeal(
                                                                                    mealField.name
                                                                                )
                                                                            }
                                                                            style={{
                                                                                color: '#ff4d4f',
                                                                            }}
                                                                        />
                                                                    }
                                                                >
                                                                    <Form.Item
                                                                        {...mealField}
                                                                        label="Название приема пищи"
                                                                        name={[
                                                                            mealField.name,
                                                                            'name',
                                                                        ]}
                                                                        fieldKey={[
                                                                            mealField.key,
                                                                            'name',
                                                                        ]}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message:
                                                                                    'Введите название приема пищи',
                                                                            },
                                                                        ]}
                                                                    >
                                                                        <Input />
                                                                    </Form.Item>

                                                                    <Form.Item
                                                                        label="Описание (опционально)"
                                                                        name={[
                                                                            mealField.name,
                                                                            'description',
                                                                        ]}
                                                                        fieldKey={[
                                                                            mealField.key,
                                                                            'description',
                                                                        ]}
                                                                    >
                                                                        <TextArea
                                                                            rows={2}
                                                                        />
                                                                    </Form.Item>

                                                                    <Form.Item
                                                                        label="Время дня (опционально)"
                                                                        name={[
                                                                            mealField.name,
                                                                            'timeOfDay',
                                                                        ]}
                                                                        fieldKey={[
                                                                            mealField.key,
                                                                            'timeOfDay',
                                                                        ]}
                                                                    >
                                                                        <Select>
                                                                            <Option value="morning">
                                                                                Утро
                                                                            </Option>
                                                                            <Option value="breakfast">
                                                                                Завтрак
                                                                            </Option>
                                                                            <Option value="lunch">
                                                                                Обед
                                                                            </Option>
                                                                            <Option value="dinner">
                                                                                Ужин
                                                                            </Option>
                                                                            <Option value="snack">
                                                                                Перекус
                                                                            </Option>
                                                                            <Option value="evening">
                                                                                Вечер
                                                                            </Option>
                                                                        </Select>
                                                                    </Form.Item>

                                                                    {/* Форма для блюд приема пищи */}
                                                                    <MealDishesForm
                                                                        dayIndex={
                                                                            dayIndex
                                                                        }
                                                                        mealIndex={
                                                                            mealIndex
                                                                        }
                                                                        form={editForm}
                                                                        allDishes={
                                                                            allDishes
                                                                        }
                                                                        onOpenDishModal={
                                                                            handleOpenDishModal
                                                                        }
                                                                    />
                                                                </Card>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            </Form.List>
                                        </Card>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    </Form>
                )}
            </Modal>

            {/* Модалка удаления шаблона */}
            <Modal
                title="Удалить шаблон плана питания"
                open={isDeleteModalOpen}
                onCancel={handleCancelDelete}
                footer={[
                    <Button key="cancel" onClick={handleCancelDelete}>
                        Отмена
                    </Button>,
                    <Button
                        key="delete"
                        type="primary"
                        danger
                        onClick={handleDelete}
                        loading={submitting}
                    >
                        Удалить
                    </Button>,
                ]}
            >
                {currentPlan && (
                    <div className={styles.deleteContent}>
                        <p>Вы уверены, что хотите удалить шаблон плана:</p>
                        <h3 className={styles.deletePlanTitle}>{currentPlan.name}</h3>
                        <p className={styles.deletePlanDetails}>
                            Уровень: {currentPlan.difficulty} • Цель: {currentPlan.goal} •
                            Длительность: {currentPlan.durationDays} дней
                        </p>
                        <p className={styles.deleteWarning}>
                            ⚠️ Это действие нельзя отменить
                        </p>
                    </div>
                )}
            </Modal>

            {/* Модалка добавления блюд из базы данных */}
            <Modal
                title="Выбрать блюдо из базы данных"
                open={isAddDishModalOpen}
                onCancel={handleCloseDishModal}
                width={800}
                footer={null}
                zIndex={2000}
                maskClosable={false}
            >
                <div className={styles.dishModalContent}>
                    {/* Фильтры блюд */}
                    <div className={styles.dishFilters}>
                        <Space size="middle" wrap>
                            <div className={styles.filterItem}>
                                <span className={styles.filterLabel}>Поиск:</span>
                                <Input
                                    placeholder="Поиск по названию или категории..."
                                    allowClear
                                    value={dishSearch}
                                    onChange={(e) => setDishSearch(e.target.value)}
                                    prefix={<SearchOutlined />}
                                    style={{ width: 250 }}
                                />
                            </div>

                            <div className={styles.filterItem}>
                                <span className={styles.filterLabel}>Категория:</span>
                                <Select
                                    placeholder="Все категории"
                                    style={{ width: 180 }}
                                    allowClear
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                >
                                    {categories.map((category) => (
                                        <Option key={category} value={category}>
                                            {category}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </Space>
                    </div>

                    {/* Список блюд */}
                    <div className={styles.dishesListModal}>
                        {filteredDishes.length > 0 ? (
                            <Row gutter={[16, 16]}>
                                {filteredDishes.map((dish) => (
                                    <Col span={12} key={dish.id}>
                                        <Card
                                            size="small"
                                            hoverable
                                            onClick={() => handleAddDishFromDB(dish)}
                                            className={styles.dishCard}
                                        >
                                            <div className={styles.dishCardContent}>
                                                <div className={styles.dishCardHeader}>
                                                    <strong>{dish.name}</strong>{' '}
                                                    {/* Изменил с dish.title */}
                                                    <Tag
                                                        color="blue"
                                                        className={styles.smallTag}
                                                    >
                                                        {dish.category}
                                                    </Tag>
                                                </div>
                                                {dish.description && (
                                                    <p
                                                        className={
                                                            styles.dishCardDescription
                                                        }
                                                    >
                                                        {dish.description.length > 100
                                                            ? `${dish.description.substring(0, 100)}...`
                                                            : dish.description}
                                                    </p>
                                                )}
                                                {dish.calories && (
                                                    <div className={styles.nutritionInfo}>
                                                        <span>Ккал: {dish.calories}</span>
                                                        <span>
                                                            Б: {dish.protein || 0}г
                                                        </span>
                                                        <span>У: {dish.carbs || 0}г</span>
                                                        <span>Ж: {dish.fat || 0}г</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div className={styles.noDishesFound}>
                                <p>Блюда не найдены</p>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};
