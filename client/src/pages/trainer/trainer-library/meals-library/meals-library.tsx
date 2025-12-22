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
    Tooltip,
    Spin,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    PlusOutlined,
    YoutubeOutlined,
    InfoCircleOutlined,
    CaretRightOutlined,
    FireOutlined,
} from '@ant-design/icons';
import { useState, useMemo, useEffect } from 'react';
import styles from './meals-library.module.scss';
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

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

interface Dish {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    category: string;
    description?: string;
    recipeUrl?: string;
    cookingTime?: string;
    difficulty?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const getCategoriesFromDishes = (dishes: Dish[]) => {
    return Array.from(new Set(dishes.map((dish) => dish.category))).sort();
};

export const MealsLibrary = () => {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [activeKeys, setActiveKeys] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentDish, setCurrentDish] = useState<Dish | null>(null);
    const [form] = Form.useForm();

    const fetchDishes = async () => {
        try {
            setLoading(true);
            const dishesRef = collection(db, 'meals');
            const q = query(dishesRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            const dishesData: Dish[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                dishesData.push({
                    id: doc.id,
                    name: data.name,
                    calories: data.calories,
                    protein: data.protein,
                    carbs: data.carbs,
                    fat: data.fat,
                    category: data.category,
                    description: data.description || '',
                    recipeUrl: data.recipeUrl || '',
                    cookingTime: data.cookingTime || '',
                    difficulty: data.difficulty || '',
                    createdAt: data.createdAt?.toDate(),
                    updatedAt: data.updatedAt?.toDate(),
                });
            });

            setDishes(dishesData);
            setCategories(getCategoriesFromDishes(dishesData));
        } catch (error) {
            console.error('Ошибка при загрузке блюд:', error);
            message.error('Не удалось загрузить блюда');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDishes();
    }, []);

    const filteredDishes = useMemo(() => {
        return dishes.filter((dish) => {
            const matchesSearch =
                searchText === '' ||
                dish.name.toLowerCase().includes(searchText.toLowerCase());

            const matchesCategory =
                selectedCategory === null || dish.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [dishes, searchText, selectedCategory]);

    const handleAccordionChange = (keys: string | string[]) => {
        setActiveKeys(Array.isArray(keys) ? keys : [keys]);
    };

    const openRecipe = (url: string) => {
        window.open(url.replace('/embed/', '/watch?v='), '_blank');
    };

    const showCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(true);
    };

    const showEditModal = (dish: Dish) => {
        setCurrentDish(dish);
        form.setFieldsValue({
            name: dish.name,
            calories: dish.calories,
            protein: dish.protein,
            carbs: dish.carbs,
            fat: dish.fat,
            category: dish.category,
            description: dish.description || '',
            recipeUrl: dish.recipeUrl || '',
            cookingTime: dish.cookingTime || '',
            difficulty: dish.difficulty || '',
        });
        setIsEditModalOpen(true);
    };

    const showDeleteModal = (dish: Dish) => {
        setCurrentDish(dish);
        setIsDeleteModalOpen(true);
    };

    const handleCancel = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setCurrentDish(null);
        form.resetFields();
        setSubmitting(false);
    };

    const handleCreate = async (values: Dish) => {
        try {
            setSubmitting(true);
            const dishesRef = collection(db, 'meals');

            const newDishData: Omit<Dish, 'id'> = {
                name: values.name,
                calories: Number(values.calories),
                protein: Number(values.protein),
                carbs: Number(values.carbs),
                fat: Number(values.fat),
                category: values.category,
                description: values.description || '',
                cookingTime: values.cookingTime || '',
                difficulty: values.difficulty || '',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            if (values.recipeUrl && values.recipeUrl.trim() !== '') {
                newDishData.recipeUrl = values.recipeUrl;
            }

            const docRef = await addDoc(dishesRef, newDishData);

            const createdDish: Dish = {
                id: docRef.id,
                ...newDishData,
                recipeUrl: newDishData.recipeUrl || '',
            };

            setDishes((prev) => [createdDish, ...prev]);

            const updatedCategories = getCategoriesFromDishes([createdDish, ...dishes]);
            setCategories(updatedCategories);

            message.success('Блюдо создано!');
            handleCancel();
        } catch (error) {
            console.error('Ошибка при создании блюда:', error);
            message.error('Не удалось создать блюдо');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (values: Dish) => {
        if (!currentDish) return;

        try {
            setSubmitting(true);
            const dishRef = doc(db, 'meals', currentDish.id);

            const updatedData: Omit<Dish, 'id'> = {
                name: values.name,
                calories: Number(values.calories),
                protein: Number(values.protein),
                carbs: Number(values.carbs),
                fat: Number(values.fat),
                category: values.category,
                description: values.description || '',
                cookingTime: values.cookingTime || '',
                difficulty: values.difficulty || '',
                updatedAt: new Date(),
            };

            if (values.recipeUrl && values.recipeUrl.trim() !== '') {
                updatedData.recipeUrl = values.recipeUrl;
            } else {
                updatedData.recipeUrl = '';
            }

            await updateDoc(dishRef, updatedData);

            setDishes((prev) =>
                prev.map((dish) =>
                    dish.id === currentDish.id
                        ? {
                              ...dish,
                              ...updatedData,
                              recipeUrl: updatedData.recipeUrl || '',
                          }
                        : dish
                )
            );

            const updatedCategories = getCategoriesFromDishes(
                dishes.map((dish) =>
                    dish.id === currentDish.id
                        ? {
                              ...dish,
                              ...updatedData,
                              recipeUrl: updatedData.recipeUrl || '',
                          }
                        : dish
                )
            );
            setCategories(updatedCategories);

            message.success('Блюдо обновлено!');
            handleCancel();
        } catch (error) {
            console.error('Ошибка при обновлении блюда:', error);
            message.error('Не удалось обновить блюдо');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!currentDish) return;

        try {
            setSubmitting(true);
            const dishRef = doc(db, 'meals', currentDish.id);
            await deleteDoc(dishRef);

            setDishes((prev) => prev.filter((dish) => dish.id !== currentDish.id));

            const updatedCategories = getCategoriesFromDishes(
                dishes.filter((dish) => dish.id !== currentDish.id)
            );
            setCategories(updatedCategories);

            message.success('Блюдо удалено!');
            handleCancel();
        } catch (error) {
            console.error('Ошибка при удалении блюда:', error);
            message.error('Не удалось удалить блюдо');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetFilters = () => {
        setSearchText('');
        setSelectedCategory(null);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" />
                <p>Загрузка блюд...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Библиотека блюд</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                    disabled={loading}
                >
                    Добавить блюдо
                </Button>
            </div>

            <div className={styles.filters}>
                <Space size="middle" wrap>
                    <div className={styles.filterItem}>
                        <span className={styles.filterLabel}>Название:</span>
                        <Search
                            placeholder="Поиск по названию..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
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

                    <Button
                        onClick={handleResetFilters}
                        disabled={!searchText && !selectedCategory}
                    >
                        Сбросить фильтры
                    </Button>
                </Space>

                <div className={styles.filterStats}>
                    Найдено блюд: {filteredDishes.length}
                    {selectedCategory && (
                        <span className={styles.activeFilter}>
                            • Категория: {selectedCategory}
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.accordionContainer}>
                {filteredDishes.length > 0 ? (
                    <Collapse
                        activeKey={activeKeys}
                        onChange={handleAccordionChange}
                        expandIcon={({ isActive }) => (
                            <CaretRightOutlined rotate={isActive ? 90 : 0} />
                        )}
                        className={styles.dishesAccordion}
                    >
                        {filteredDishes.map((dish) => (
                            <Panel
                                header={
                                    <div className={styles.panelHeader}>
                                        <div className={styles.dishHeader}>
                                            <div className={styles.dishTitle}>
                                                {dish.name}
                                            </div>
                                            <div className={styles.dishTags}>
                                                <Tag
                                                    color="green"
                                                    className={styles.categoryTag}
                                                >
                                                    {dish.category}
                                                </Tag>
                                                <div className={styles.dishNutrition}>
                                                    <span className={styles.calories}>
                                                        <FireOutlined /> {dish.calories}{' '}
                                                        ккал
                                                    </span>
                                                    <span className={styles.protein}>
                                                        Б: {dish.protein}г
                                                    </span>
                                                    <span className={styles.carbs}>
                                                        У: {dish.carbs}г
                                                    </span>
                                                    <span className={styles.fat}>
                                                        Ж: {dish.fat}г
                                                    </span>
                                                </div>
                                                {dish.cookingTime && (
                                                    <Tag color="blue">
                                                        {dish.cookingTime}
                                                    </Tag>
                                                )}
                                                {dish.difficulty && (
                                                    <Tag
                                                        color={
                                                            dish.difficulty === 'Легко'
                                                                ? 'green'
                                                                : dish.difficulty ===
                                                                    'Средне'
                                                                  ? 'orange'
                                                                  : 'red'
                                                        }
                                                    >
                                                        {dish.difficulty}
                                                    </Tag>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.dishActions}>
                                            {dish.recipeUrl && (
                                                <Tooltip title="Посмотреть рецепт">
                                                    <Button
                                                        type="text"
                                                        icon={<YoutubeOutlined />}
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openRecipe(dish.recipeUrl!);
                                                        }}
                                                    />
                                                </Tooltip>
                                            )}
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                type="text"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showEditModal(dish);
                                                }}
                                            />
                                            <Button
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                type="text"
                                                danger
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showDeleteModal(dish);
                                                }}
                                            />
                                        </div>
                                    </div>
                                }
                                key={dish.id}
                                className={styles.dishPanel}
                            >
                                <div className={styles.panelContent}>
                                    {dish.description && (
                                        <div className={styles.descriptionSection}>
                                            <h4 className={styles.sectionTitle}>
                                                <InfoCircleOutlined /> Описание
                                            </h4>
                                            <p className={styles.dishDescription}>
                                                {dish.description}
                                            </p>
                                        </div>
                                    )}

                                    <div className={styles.nutritionSection}>
                                        <h4 className={styles.sectionTitle}>
                                            <FireOutlined /> Пищевая ценность на порцию
                                        </h4>
                                        <div className={styles.nutritionGrid}>
                                            <div className={styles.nutritionItem}>
                                                <div className={styles.nutritionValue}>
                                                    {dish.calories}
                                                </div>
                                                <div className={styles.nutritionLabel}>
                                                    Калории
                                                </div>
                                            </div>
                                            <div className={styles.nutritionItem}>
                                                <div className={styles.nutritionValue}>
                                                    {dish.protein}г
                                                </div>
                                                <div className={styles.nutritionLabel}>
                                                    Белки
                                                </div>
                                            </div>
                                            <div className={styles.nutritionItem}>
                                                <div className={styles.nutritionValue}>
                                                    {dish.carbs}г
                                                </div>
                                                <div className={styles.nutritionLabel}>
                                                    Углеводы
                                                </div>
                                            </div>
                                            <div className={styles.nutritionItem}>
                                                <div className={styles.nutritionValue}>
                                                    {dish.fat}г
                                                </div>
                                                <div className={styles.nutritionLabel}>
                                                    Жиры
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {dish.recipeUrl && (
                                        <div className={styles.videoSection}>
                                            <h4 className={styles.sectionTitle}>
                                                <YoutubeOutlined /> Видео рецепта
                                            </h4>
                                            <div className={styles.videoContainer}>
                                                <iframe
                                                    width="100%"
                                                    height="315"
                                                    src={dish.recipeUrl}
                                                    title={`Рецепт: ${dish.name}`}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                                <Button
                                                    type="link"
                                                    onClick={() =>
                                                        openRecipe(dish.recipeUrl!)
                                                    }
                                                    className={styles.videoButton}
                                                >
                                                    Открыть на YouTube
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Panel>
                        ))}
                    </Collapse>
                ) : (
                    <div className={styles.noResults}>
                        <p>По вашему запросу ничего не найдено</p>
                        <Button onClick={handleResetFilters}>Показать все блюда</Button>
                    </div>
                )}
            </div>

            <Modal
                title="Создать новое блюдо"
                open={isCreateModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Отмена
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => form.submit()}
                        loading={submitting}
                    >
                        Создать
                    </Button>,
                ]}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item
                        name="name"
                        label="Название блюда"
                        rules={[{ required: true, message: 'Введите название' }]}
                    >
                        <Input placeholder="Например: Куриная грудка на гриле" />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Категория"
                        rules={[{ required: true, message: 'Выберите категорию' }]}
                    >
                        <Select placeholder="Выберите категорию">
                            {categories.map((category) => (
                                <Option key={category} value={category}>
                                    {category}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <div className={styles.formRow}>
                        <Form.Item
                            name="calories"
                            label="Калории"
                            rules={[
                                { required: true, message: 'Введите калории' },
                                {
                                    validator: (_, value) => {
                                        const numValue = Number(value);
                                        if (isNaN(numValue) || numValue < 0) {
                                            return Promise.reject(new Error('Минимум 0'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            className={styles.formQuarter}
                        >
                            <Input type="number" min={0} placeholder="ккал" />
                        </Form.Item>
                        <Form.Item
                            name="protein"
                            label="Белки"
                            rules={[
                                { required: true, message: 'Введите белки' },
                                {
                                    validator: (_, value) => {
                                        const numValue = Number(value);
                                        if (isNaN(numValue) || numValue < 0) {
                                            return Promise.reject(new Error('Минимум 0'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            className={styles.formQuarter}
                        >
                            <Input type="number" min={0} placeholder="г" />
                        </Form.Item>
                        <Form.Item
                            name="carbs"
                            label="Углеводы"
                            rules={[
                                { required: true, message: 'Введите углеводы' },
                                {
                                    validator: (_, value) => {
                                        const numValue = Number(value);
                                        if (isNaN(numValue) || numValue < 0) {
                                            return Promise.reject(new Error('Минимум 0'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            className={styles.formQuarter}
                        >
                            <Input type="number" min={0} placeholder="г" />
                        </Form.Item>
                        <Form.Item
                            name="fat"
                            label="Жиры"
                            rules={[
                                { required: true, message: 'Введите жиры' },
                                {
                                    validator: (_, value) => {
                                        const numValue = Number(value);
                                        if (isNaN(numValue) || numValue < 0) {
                                            return Promise.reject(new Error('Минимум 0'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            className={styles.formQuarter}
                        >
                            <Input type="number" min={0} placeholder="г" />
                        </Form.Item>
                    </div>

                    <div className={styles.formRow}>
                        <Form.Item
                            name="cookingTime"
                            label="Время готовки"
                            className={styles.formHalf}
                        >
                            <Input placeholder="Например: 20-25 мин" />
                        </Form.Item>

                        <Form.Item
                            name="difficulty"
                            label="Сложность"
                            className={styles.formHalf}
                        >
                            <Select placeholder="Выберите сложность">
                                <Option value="Легко">Легко</Option>
                                <Option value="Средне">Средне</Option>
                                <Option value="Сложно">Сложно</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="recipeUrl"
                        label="Ссылка на видео рецепта (YouTube)"
                        rules={[
                            {
                                pattern:
                                    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
                                message: 'Введите корректную ссылку на YouTube',
                            },
                        ]}
                    >
                        <Input placeholder="https://www.youtube.com/watch?v=..." />
                    </Form.Item>

                    <Form.Item name="description" label="Описание">
                        <TextArea
                            rows={4}
                            placeholder="Описание блюда, ингредиенты, способ приготовления..."
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Редактировать блюдо"
                open={isEditModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Отмена
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => form.submit()}
                        loading={submitting}
                    >
                        Сохранить
                    </Button>,
                ]}
                width={600}
            >
                {currentDish && (
                    <Form form={form} layout="vertical" onFinish={handleEdit}>
                        <Form.Item
                            name="name"
                            label="Название блюда"
                            rules={[{ required: true, message: 'Введите название' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="category"
                            label="Категория"
                            rules={[{ required: true, message: 'Выберите категорию' }]}
                        >
                            <Select>
                                {categories.map((category) => (
                                    <Option key={category} value={category}>
                                        {category}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div className={styles.formRow}>
                            <Form.Item
                                name="calories"
                                label="Калории"
                                rules={[
                                    { required: true, message: 'Введите калории' },
                                    {
                                        validator: (_, value) => {
                                            const numValue = Number(value);
                                            if (isNaN(numValue) || numValue < 0) {
                                                return Promise.reject(
                                                    new Error('Минимум 0')
                                                );
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                                className={styles.formQuarter}
                            >
                                <Input type="number" min={0} placeholder="ккал" />
                            </Form.Item>
                            <Form.Item
                                name="protein"
                                label="Белки"
                                rules={[
                                    { required: true, message: 'Введите белки' },
                                    {
                                        validator: (_, value) => {
                                            const numValue = Number(value);
                                            if (isNaN(numValue) || numValue < 0) {
                                                return Promise.reject(
                                                    new Error('Минимум 0')
                                                );
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                                className={styles.formQuarter}
                            >
                                <Input type="number" min={0} placeholder="г" />
                            </Form.Item>
                            <Form.Item
                                name="carbs"
                                label="Углеводы"
                                rules={[
                                    { required: true, message: 'Введите углеводы' },
                                    {
                                        validator: (_, value) => {
                                            const numValue = Number(value);
                                            if (isNaN(numValue) || numValue < 0) {
                                                return Promise.reject(
                                                    new Error('Минимум 0')
                                                );
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                                className={styles.formQuarter}
                            >
                                <Input type="number" min={0} placeholder="г" />
                            </Form.Item>
                            <Form.Item
                                name="fat"
                                label="Жиры"
                                rules={[
                                    { required: true, message: 'Введите жиры' },
                                    {
                                        validator: (_, value) => {
                                            const numValue = Number(value);
                                            if (isNaN(numValue) || numValue < 0) {
                                                return Promise.reject(
                                                    new Error('Минимум 0')
                                                );
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                                className={styles.formQuarter}
                            >
                                <Input type="number" min={0} placeholder="г" />
                            </Form.Item>
                        </div>

                        <div className={styles.formRow}>
                            <Form.Item
                                name="cookingTime"
                                label="Время готовки"
                                className={styles.formHalf}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="difficulty"
                                label="Сложность"
                                className={styles.formHalf}
                            >
                                <Select>
                                    <Option value="Легко">Легко</Option>
                                    <Option value="Средне">Средне</Option>
                                    <Option value="Сложно">Сложно</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="recipeUrl"
                            label="Ссылка на видео рецепта (YouTube)"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item name="description" label="Описание">
                            <TextArea rows={4} />
                        </Form.Item>
                    </Form>
                )}
            </Modal>

            <Modal
                title="Удалить блюдо"
                open={isDeleteModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
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
                {currentDish && (
                    <div className={styles.deleteContent}>
                        <p>Вы уверены, что хотите удалить блюдо:</p>
                        <h3 className={styles.deleteDishTitle}>{currentDish.name}</h3>
                        <p className={styles.deleteDishDetails}>
                            Категория: {currentDish.category} • Калории:{' '}
                            {currentDish.calories} ккал
                        </p>
                        <p className={styles.deleteWarning}>
                            ⚠️ Это действие нельзя отменить
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};
