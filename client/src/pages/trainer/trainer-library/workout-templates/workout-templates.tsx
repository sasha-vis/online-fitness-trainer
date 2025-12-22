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
    type FormInstance,
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
import styles from './workout-templates.module.scss';
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

interface Exercise {
    id: string;
    title: string;
    muscleGroup: string;
    description?: string;
    videoUrl?: string;
}

interface WorkoutExercise {
    exerciseId: string;
    exerciseTitle: string;
    muscleGroup: string;
    sets: number;
    reps: string;
    order: number;
}

interface Workout {
    id: string;
    name: string;
    description?: string;
    exercises: WorkoutExercise[];
    dayOfWeek?: number | null;
}

interface Week {
    id: string;
    weekNumber: number;
    name: string;
    workouts: Workout[];
}

interface TrainingPlanTemplate {
    id: string;
    name: string;
    description: string;
    durationWeeks: number;
    difficulty: 'Начинающий' | 'Средний' | 'Продвинутый';
    goal: string;
    weeks: Week[];
    createdAt?: Date;
    updatedAt?: Date;
}

interface WeekFormData {
    weekNumber: number;
    name?: string;
    workouts?: WorkoutFormData[];
}

interface WorkoutFormData {
    id?: string;
    name: string;
    description?: string;
    dayOfWeek?: number | null;
    exercises?: WorkoutExercise[];
}

interface TrainingPlanFormData {
    name: string;
    description: string;
    durationWeeks: number;
    difficulty: 'Начинающий' | 'Средний' | 'Продвинутый';
    goal: string;
    weeks: WeekFormData[];
}

interface FormListField {
    key: number;
    name: number;
    fieldKey?: number;
}

interface WorkoutExercisesFormProps {
    weekIndex: number;
    workoutIndex: number;
    form: FormInstance<TrainingPlanFormData>;
    allExercises: Exercise[];
    onOpenExerciseModal: (
        weekIndex: number,
        workoutIndex: number,
        form: FormInstance<TrainingPlanFormData>
    ) => void;
}

const getGoalsFromPlans = (plans: TrainingPlanTemplate[]): string[] => {
    return Array.from(new Set(plans.map((plan) => plan.goal))).sort();
};

const getDifficultiesFromPlans = (plans: TrainingPlanTemplate[]): string[] => {
    return Array.from(new Set(plans.map((plan) => plan.difficulty))).sort();
};

const WorkoutExercisesForm = ({
    weekIndex,
    workoutIndex,
    form,
    onOpenExerciseModal,
}: WorkoutExercisesFormProps) => {
    const exercises: WorkoutExercise[] =
        Form.useWatch(
            ['weeks', weekIndex, 'workouts', workoutIndex, 'exercises'],
            form
        ) || [];

    const handleAddExercise = () => {
        const newExercise: WorkoutExercise = {
            exerciseId: `temp-${Date.now()}`,
            exerciseTitle: 'Новое упражнение',
            muscleGroup: 'Грудь',
            sets: 3,
            reps: '8-12',
            order: exercises.length,
        };

        const updatedExercises = [...exercises, newExercise];
        const currentWeeks: WeekFormData[] = form?.getFieldValue('weeks') || [];
        const updatedWeeks = [...currentWeeks];

        if (!updatedWeeks[weekIndex]) {
            updatedWeeks[weekIndex] = { weekNumber: weekIndex + 1, workouts: [] };
        }
        if (!updatedWeeks[weekIndex].workouts?.[workoutIndex]) {
            if (!updatedWeeks[weekIndex].workouts) {
                updatedWeeks[weekIndex].workouts = [];
            }
            updatedWeeks[weekIndex].workouts[workoutIndex] = {
                name: 'Новая тренировка',
                exercises: [],
            };
        }

        updatedWeeks[weekIndex].workouts[workoutIndex].exercises = updatedExercises;
        form?.setFieldsValue({ weeks: updatedWeeks });
    };

    const handleRemoveExercise = (exerciseIndex: number) => {
        const updatedExercises = exercises.filter((_, i: number) => i !== exerciseIndex);
        const currentWeeks: WeekFormData[] = form?.getFieldValue('weeks') || [];
        const updatedWeeks = [...currentWeeks];

        if (updatedWeeks[weekIndex]?.workouts?.[workoutIndex]) {
            updatedWeeks[weekIndex].workouts[workoutIndex].exercises = updatedExercises;
        }

        form?.setFieldsValue({ weeks: updatedWeeks });
    };

    const handleExerciseChange = (
        exerciseIndex: number,
        field: keyof WorkoutExercise,
        value: string | number
    ) => {
        const updatedExercises = [...exercises];
        updatedExercises[exerciseIndex] = {
            ...updatedExercises[exerciseIndex],
            [field]: field === 'sets' ? Number(value) : value,
        };

        const currentWeeks: WeekFormData[] = form?.getFieldValue('weeks') || [];
        const updatedWeeks = [...currentWeeks];

        if (updatedWeeks[weekIndex]?.workouts?.[workoutIndex]) {
            updatedWeeks[weekIndex].workouts[workoutIndex].exercises = updatedExercises;
        }

        form?.setFieldsValue({ weeks: updatedWeeks });
    };

    return (
        <div className={styles.exercisesSection}>
            <div className={styles.exercisesHeader}>
                <h5>Упражнения</h5>
                <Space>
                    <Button
                        type="dashed"
                        size="small"
                        onClick={handleAddExercise}
                        icon={<PlusCircleOutlined />}
                    >
                        Новое упражнение
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenExerciseModal(weekIndex, workoutIndex, form);
                        }}
                        icon={<PlusOutlined />}
                    >
                        Выбрать из базы
                    </Button>
                </Space>
            </div>

            {exercises.length === 0 ? (
                <div className={styles.emptyExercises}>
                    <p>Упражнения не добавлены</p>
                </div>
            ) : (
                <div className={styles.exercisesList}>
                    {exercises.map((exercise: WorkoutExercise, index: number) => (
                        <div key={index} className={styles.exerciseRow}>
                            <div className={styles.exerciseFields}>
                                <Input
                                    value={exercise.exerciseTitle}
                                    onChange={(e) =>
                                        handleExerciseChange(
                                            index,
                                            'exerciseTitle',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Название упражнения"
                                    style={{ flex: 2 }}
                                />
                                <Select
                                    value={exercise.muscleGroup}
                                    onChange={(value) =>
                                        handleExerciseChange(index, 'muscleGroup', value)
                                    }
                                    style={{ flex: 1 }}
                                    placeholder="Группа мышц"
                                >
                                    <Option value="Грудь">Грудь</Option>
                                    <Option value="Спина">Спина</Option>
                                    <Option value="Ноги">Ноги</Option>
                                    <Option value="Плечи">Плечи</Option>
                                    <Option value="Бицепс">Бицепс</Option>
                                    <Option value="Трицепс">Трицепс</Option>
                                    <Option value="Пресс">Пресс</Option>
                                    <Option value="Икры">Икры</Option>
                                    <Option value="Трапеции">Трапеции</Option>
                                    <Option value="Предплечья">Предплечья</Option>
                                </Select>
                                <Input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={exercise.sets || ''}
                                    onChange={(e) => {
                                        handleExerciseChange(
                                            index,
                                            'sets',
                                            parseInt(e.target.value) || 0
                                        );
                                    }}
                                    placeholder="Подходы"
                                    style={{ width: '100px' }}
                                />
                                <Input
                                    value={exercise.reps || ''}
                                    onChange={(e) =>
                                        handleExerciseChange(
                                            index,
                                            'reps',
                                            e.target.value
                                        )
                                    }
                                    placeholder="8-12"
                                    style={{ width: '100px' }}
                                />
                            </div>
                            <Button
                                type="text"
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => handleRemoveExercise(index)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const WorkoutTemplates = () => {
    const [plans, setPlans] = useState<TrainingPlanTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [activeKeys, setActiveKeys] = useState<string[]>([]);
    const [goals, setGoals] = useState<string[]>([]);
    const [difficulties, setDifficulties] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [allExercises, setAllExercises] = useState<Exercise[]>([]);
    const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
    const [currentWorkoutContext, setCurrentWorkoutContext] = useState<{
        weekIndex: number;
        workoutIndex: number;
    } | null>(null);
    const [currentForm, setCurrentForm] = useState<FormInstance | null>(null);
    const [exerciseSearch, setExerciseSearch] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<TrainingPlanTemplate | null>(null);
    const [createForm] = Form.useForm<TrainingPlanFormData>();
    const [editForm] = Form.useForm<TrainingPlanFormData>();

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const plansRef = collection(db, 'trainingPlanTemplates');
            const q = query(plansRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            const plansData: TrainingPlanTemplate[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                plansData.push({
                    id: doc.id,
                    name: data.name,
                    description: data.description,
                    durationWeeks: data.durationWeeks,
                    difficulty: data.difficulty,
                    goal: data.goal,
                    weeks: data.weeks || [],
                    createdAt: data.createdAt?.toDate(),
                    updatedAt: data.updatedAt?.toDate(),
                });
            });

            setPlans(plansData);
            setGoals(getGoalsFromPlans(plansData));
            setDifficulties(getDifficultiesFromPlans(plansData));
        } catch (error) {
            console.error('Ошибка при загрузке шаблонов планов:', error);
            message.error('Не удалось загрузить шаблоны планов тренировок');
        } finally {
            setLoading(false);
        }
    };

    const fetchExercises = async () => {
        try {
            const exercisesRef = collection(db, 'exercises');
            const q = query(exercisesRef, orderBy('title'));
            const querySnapshot = await getDocs(q);

            const exercisesData: Exercise[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                exercisesData.push({
                    id: doc.id,
                    title: data.title,
                    muscleGroup: data.muscleGroup,
                    description: data.description || '',
                    videoUrl: data.videoUrl || '',
                });
            });

            setAllExercises(exercisesData);
        } catch (error) {
            console.error('Ошибка при загрузке упражнений:', error);
        }
    };

    useEffect(() => {
        fetchPlans();
        fetchExercises();
    }, []);

    const filteredExercises = useMemo(() => {
        return allExercises.filter((exercise) => {
            const matchesSearch =
                exerciseSearch === '' ||
                exercise.title.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
                exercise.muscleGroup.toLowerCase().includes(exerciseSearch.toLowerCase());

            const matchesMuscleGroup =
                selectedMuscleGroup === null ||
                exercise.muscleGroup === selectedMuscleGroup;

            return matchesSearch && matchesMuscleGroup;
        });
    }, [allExercises, exerciseSearch, selectedMuscleGroup]);

    const muscleGroups = useMemo(() => {
        return Array.from(new Set(allExercises.map((ex) => ex.muscleGroup))).sort();
    }, [allExercises]);

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

    const handleAccordionChange = (keys: string | string[]) => {
        setActiveKeys(Array.isArray(keys) ? keys : [keys]);
    };

    const handleOpenExerciseModal = (
        weekIndex: number,
        workoutIndex: number,
        form: FormInstance<TrainingPlanFormData>
    ) => {
        setCurrentWorkoutContext({ weekIndex, workoutIndex });
        setCurrentForm(form);
        setIsAddExerciseModalOpen(true);
    };

    const handleAddExerciseFromDB = (exercise: Exercise) => {
        if (!currentWorkoutContext || !currentForm) return;

        const { weekIndex, workoutIndex } = currentWorkoutContext;

        const currentWeeks: WeekFormData[] = currentForm.getFieldValue('weeks') || [];
        const updatedWeeks = [...currentWeeks];

        if (!updatedWeeks[weekIndex]) {
            updatedWeeks[weekIndex] = { weekNumber: weekIndex + 1, workouts: [] };
        }
        if (!updatedWeeks[weekIndex].workouts?.[workoutIndex]) {
            if (!updatedWeeks[weekIndex].workouts) {
                updatedWeeks[weekIndex].workouts = [];
            }
            updatedWeeks[weekIndex].workouts[workoutIndex] = {
                name: 'Новая тренировка',
                exercises: [],
            };
        }

        const currentExercises =
            updatedWeeks[weekIndex].workouts![workoutIndex].exercises || [];

        if (
            currentExercises.some((ex: WorkoutExercise) => ex.exerciseId === exercise.id)
        ) {
            message.warning('Это упражнение уже добавлено в тренировку');
            return;
        }

        const newExercise: WorkoutExercise = {
            exerciseId: exercise.id,
            exerciseTitle: exercise.title,
            muscleGroup: exercise.muscleGroup,
            sets: 3,
            reps: '8-12',
            order: currentExercises.length,
        };

        updatedWeeks[weekIndex].workouts![workoutIndex].exercises = [
            ...currentExercises,
            newExercise,
        ];

        currentForm.setFieldsValue({
            weeks: updatedWeeks,
        });

        message.success('Упражнение добавлено в тренировку');
        handleCloseExerciseModal();
    };

    const updatePlanInFirebase = async (
        planId: string,
        data: Partial<TrainingPlanTemplate>
    ) => {
        try {
            const planRef = doc(db, 'trainingPlanTemplates', planId);

            const cleanData = {
                ...data,
                weeks: data.weeks || [],
                updatedAt: new Date(),
            };

            await updateDoc(planRef, cleanData);
            return true;
        } catch (error) {
            console.error('Ошибка при обновлении плана:', error);
            throw error;
        }
    };

    const showCreateModal = () => {
        createForm.resetFields();
        createForm.setFieldsValue({
            name: '',
            description: '',
            durationWeeks: 4,
            difficulty: 'Начинающий',
            goal: 'Общее развитие',
            weeks: [
                {
                    weekNumber: 1,
                    name: 'Неделя 1',
                    workouts: [],
                },
            ],
        });
        setIsCreateModalOpen(true);
    };

    const showEditModal = (plan: TrainingPlanTemplate) => {
        setCurrentPlan(plan);

        const formData: TrainingPlanFormData = {
            name: plan.name,
            description: plan.description,
            durationWeeks: plan.durationWeeks,
            difficulty: plan.difficulty,
            goal: plan.goal,
            weeks:
                plan.weeks.length > 0
                    ? plan.weeks.map((week) => ({
                          weekNumber: week.weekNumber,
                          name: week.name,
                          workouts: week.workouts.map((workout) => ({
                              id: workout.id,
                              name: workout.name,
                              description: workout.description || '',
                              dayOfWeek: workout.dayOfWeek || null,
                              exercises: workout.exercises,
                          })),
                      }))
                    : [
                          {
                              weekNumber: 1,
                              name: 'Неделя 1',
                              workouts: [],
                          },
                      ],
        };

        editForm.setFieldsValue(formData);
        setIsEditModalOpen(true);
    };

    const showDeleteModal = (plan: TrainingPlanTemplate) => {
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

    const handleCloseExerciseModal = () => {
        setIsAddExerciseModalOpen(false);
        setCurrentWorkoutContext(null);
        setCurrentForm(null);
        setExerciseSearch('');
        setSelectedMuscleGroup(null);
    };

    const handleCreate = async (values: TrainingPlanFormData) => {
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
            const plansRef = collection(db, 'trainingPlanTemplates');

            const cleanWeeks: Week[] = (values.weeks || []).map((week, index) => ({
                id: `week-${Date.now()}-${index}`,
                weekNumber: Number(week.weekNumber) || index + 1,
                name: week.name?.trim() || `Неделя ${week.weekNumber || index + 1}`,
                workouts: (week.workouts || []).map((workout, workoutIndex) => ({
                    id: workout.id || `workout-${Date.now()}-${workoutIndex}`,
                    name: workout.name?.trim() || `Тренировка ${workoutIndex + 1}`,
                    description: workout.description?.trim() || '',
                    dayOfWeek: workout.dayOfWeek ?? null,
                    exercises: (workout.exercises || []).map((exercise, exIndex) => ({
                        exerciseId:
                            exercise.exerciseId || `exercise-${Date.now()}-${exIndex}`,
                        exerciseTitle:
                            exercise.exerciseTitle?.trim() || 'Новое упражнение',
                        muscleGroup: exercise.muscleGroup?.trim() || 'Грудь',
                        sets: Number(exercise.sets) || 3,
                        reps: exercise.reps?.trim() || '8-12',
                        order: exIndex,
                    })),
                })),
            }));

            const newPlanData: Omit<TrainingPlanTemplate, 'id'> = {
                name: values.name?.trim() || 'Новый план тренировок',
                description: values.description?.trim() || 'Описание плана тренировок',
                durationWeeks: Number(values.durationWeeks) || 4,
                difficulty: values.difficulty || 'Начинающий',
                goal: values.goal?.trim() || 'Общее развитие',
                weeks: cleanWeeks,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const docRef = await addDoc(plansRef, newPlanData);

            const createdPlan: TrainingPlanTemplate = {
                id: docRef.id,
                ...newPlanData,
            };

            setPlans((prev) => [createdPlan, ...prev]);
            setGoals(getGoalsFromPlans([createdPlan, ...plans]));
            setDifficulties(getDifficultiesFromPlans([createdPlan, ...plans]));

            message.success('Шаблон плана тренировок создан!');
            handleCancelCreate();
        } catch (error) {
            console.error('Ошибка при создании шаблона плана:', error);
            message.error('Не удалось создать шаблон плана');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (values: TrainingPlanFormData) => {
        if (!currentPlan) return;

        try {
            setSubmitting(true);

            const cleanWeeks: Week[] = (values.weeks || []).map((week, index) => ({
                id: week.weekNumber
                    ? `week-${week.weekNumber}`
                    : `week-${Date.now()}-${index}`,
                weekNumber: Number(week.weekNumber) || index + 1,
                name: week.name?.trim() || `Неделя ${week.weekNumber || index + 1}`,
                workouts: (week.workouts || []).map((workout, workoutIndex) => ({
                    id: workout.id || `workout-${Date.now()}-${workoutIndex}`,
                    name: workout.name?.trim() || `Тренировка ${workoutIndex + 1}`,
                    description: workout.description?.trim() || '',
                    dayOfWeek: workout.dayOfWeek ?? null,
                    exercises: (workout.exercises || []).map((exercise, exIndex) => ({
                        exerciseId:
                            exercise.exerciseId || `exercise-${Date.now()}-${exIndex}`,
                        exerciseTitle:
                            exercise.exerciseTitle?.trim() || 'Новое упражнение',
                        muscleGroup: exercise.muscleGroup?.trim() || 'Грудь',
                        sets: Number(exercise.sets) || 3,
                        reps: exercise.reps?.trim() || '8-12',
                        order: exIndex,
                    })),
                })),
            }));

            const updatedData: Partial<TrainingPlanTemplate> = {
                name: values.name?.trim() || 'Новый план тренировок',
                description: values.description?.trim() || 'Описание плана тренировок',
                durationWeeks: Number(values.durationWeeks) || 4,
                difficulty: values.difficulty || 'Начинающий',
                goal: values.goal?.trim() || 'Общее развитие',
                weeks: cleanWeeks,
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

            message.success('Шаблон плана обновлен!');
            handleCancelEdit();
        } catch (error) {
            console.error('Ошибка при обновлении шаблона плана:', error);
            message.error('Не удалось обновить шаблон плана');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!currentPlan) return;

        try {
            setSubmitting(true);
            const planRef = doc(db, 'trainingPlanTemplates', currentPlan.id);
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

            message.success('Шаблон плана удален!');
            handleCancelDelete();
        } catch (error) {
            console.error('Ошибка при удалении шаблона плана:', error);
            message.error('Не удалось удалить шаблон плана');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetFilters = () => {
        setSearchText('');
        setSelectedGoal(null);
        setSelectedDifficulty(null);
    };

    const getDayName = (dayIndex: number): string => {
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        return days[dayIndex] || 'Любой';
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" />
                <p>Загрузка шаблонов планов тренировок...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Шаблоны планов тренировок</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                    disabled={loading}
                >
                    Создать шаблон
                </Button>
            </div>

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
                                                    {plan.durationWeeks} недели
                                                </div>
                                                {plan.weeks && plan.weeks.length > 0 && (
                                                    <div className={styles.planWeeks}>
                                                        {plan.weeks.length} недель
                                                        тренировок
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
                                    <div className={styles.descriptionSection}>
                                        <h4 className={styles.sectionTitle}>
                                            <InfoCircleOutlined /> Описание шаблона
                                        </h4>
                                        <p className={styles.planDescription}>
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className={styles.planDetails}>
                                        <Row gutter={[16, 16]}>
                                            <Col span={8}>
                                                <Card
                                                    size="small"
                                                    title="Продолжительность"
                                                >
                                                    <div className={styles.detailValue}>
                                                        {plan.durationWeeks} недель
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

                                    {plan.weeks && plan.weeks.length > 0 ? (
                                        <div className={styles.weeksSection}>
                                            <h4 className={styles.sectionTitle}>
                                                <CalendarOutlined /> Структура плана (Если
                                                несколько недель, то чередуем по порядку)
                                            </h4>
                                            <Collapse className={styles.weeksAccordion}>
                                                {plan.weeks.map((week, weekIndex) => (
                                                    <Panel
                                                        header={`Неделя ${week.weekNumber}: ${week.name || `Неделя ${week.weekNumber}`}`}
                                                        key={
                                                            week.id ||
                                                            weekIndex.toString()
                                                        }
                                                    >
                                                        {week.workouts &&
                                                        week.workouts.length > 0 ? (
                                                            <div
                                                                className={
                                                                    styles.workoutsList
                                                                }
                                                            >
                                                                {week.workouts.map(
                                                                    (
                                                                        workout,
                                                                        workoutIndex
                                                                    ) => (
                                                                        <Card
                                                                            key={
                                                                                workout.id ||
                                                                                workoutIndex
                                                                            }
                                                                            size="small"
                                                                            title={`${workout.name} ${workout.dayOfWeek !== undefined && workout.dayOfWeek !== null ? `(${getDayName(workout.dayOfWeek)})` : ''}`}
                                                                            className={
                                                                                styles.workoutCard
                                                                            }
                                                                        >
                                                                            {workout.description && (
                                                                                <p>
                                                                                    {
                                                                                        workout.description
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                            {workout.exercises &&
                                                                            workout
                                                                                .exercises
                                                                                .length >
                                                                                0 ? (
                                                                                <div
                                                                                    className={
                                                                                        styles.exercisesList
                                                                                    }
                                                                                >
                                                                                    <h5>
                                                                                        Упражнения:
                                                                                    </h5>
                                                                                    {workout.exercises.map(
                                                                                        (
                                                                                            exercise,
                                                                                            exIndex
                                                                                        ) => (
                                                                                            <div
                                                                                                key={
                                                                                                    exIndex
                                                                                                }
                                                                                                className={
                                                                                                    styles.exerciseItem
                                                                                                }
                                                                                            >
                                                                                                <div
                                                                                                    className={
                                                                                                        styles.exerciseInfo
                                                                                                    }
                                                                                                >
                                                                                                    <div
                                                                                                        className={
                                                                                                            styles.exerciseTitleRow
                                                                                                        }
                                                                                                    >
                                                                                                        <strong>
                                                                                                            {
                                                                                                                exercise.exerciseTitle
                                                                                                            }
                                                                                                        </strong>
                                                                                                        <Tag
                                                                                                            color="blue"
                                                                                                            className={
                                                                                                                styles.smallTag
                                                                                                            }
                                                                                                        >
                                                                                                            {
                                                                                                                exercise.muscleGroup
                                                                                                            }
                                                                                                        </Tag>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className={
                                                                                                            styles.exerciseParams
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
                                                                                                                Подходы:
                                                                                                            </span>
                                                                                                            <span>
                                                                                                                {
                                                                                                                    exercise.sets
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
                                                                                                                Повторения:
                                                                                                            </span>
                                                                                                            <span>
                                                                                                                {
                                                                                                                    exercise.reps
                                                                                                                }
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
                                                                                        styles.emptyExercises
                                                                                    }
                                                                                >
                                                                                    <p
                                                                                        className={
                                                                                            styles.emptyText
                                                                                        }
                                                                                    >
                                                                                        Упражнения
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
                                                                    styles.emptyWorkouts
                                                                }
                                                            >
                                                                <p
                                                                    className={
                                                                        styles.emptyText
                                                                    }
                                                                >
                                                                    Тренировки не
                                                                    добавлены для этой
                                                                    недели
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
                                                Недели тренировок не добавлены
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

            <Modal
                title="Создать новый шаблон плана тренировок"
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
                <Form<TrainingPlanFormData>
                    form={createForm}
                    layout="vertical"
                    onFinish={handleCreate}
                >
                    <Form.Item<TrainingPlanFormData>
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
                        <Input placeholder="Например: Базовый план для начинающих" />
                    </Form.Item>
                    <Form.Item<TrainingPlanFormData>
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
                            placeholder="Опишите цели и особенности шаблона..."
                        />
                    </Form.Item>
                    <div className={styles.formRow}>
                        <Form.Item<TrainingPlanFormData>
                            name="durationWeeks"
                            label="Продолжительность (недель)"
                            normalize={(value) => Number(value)}
                            rules={[
                                { required: true, message: 'Введите продолжительность' },
                                {
                                    type: 'number',
                                    min: 1,
                                    max: 52,
                                    message: 'От 1 до 52 недель',
                                },
                            ]}
                            className={styles.formThird}
                        >
                            <Input type="number" min={1} max={52} />
                        </Form.Item>

                        <Form.Item<TrainingPlanFormData>
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

                        <Form.Item<TrainingPlanFormData>
                            name="goal"
                            label="Цель плана"
                            rules={[{ required: true, message: 'Введите цель плана' }]}
                            className={styles.formThird}
                        >
                            <Input placeholder="Например: Набор массы, Похудение, Развитие силы" />
                        </Form.Item>
                    </div>
                    <Form.List name="weeks">
                        {(fields, { add, remove }) => (
                            <>
                                <div className={styles.formSectionHeader}>
                                    <h4>Недели тренировок</h4>
                                    <Button
                                        type="dashed"
                                        onClick={() =>
                                            add({
                                                weekNumber: fields.length + 1,
                                                name: `Неделя ${fields.length + 1}`,
                                                workouts: [],
                                            })
                                        }
                                        icon={<PlusCircleOutlined />}
                                    >
                                        Добавить неделю
                                    </Button>
                                </div>

                                {fields.length === 0 && (
                                    <p className={styles.emptyText}>
                                        Добавьте хотя бы одну неделю тренировок
                                    </p>
                                )}

                                {fields.map((field: FormListField, weekIndex: number) => (
                                    <Card
                                        key={field.key}
                                        title={`Неделя ${weekIndex + 1}`}
                                        size="small"
                                        className={styles.weekCard}
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
                                            name={[field.name, 'weekNumber']}
                                            fieldKey={[field.key, 'weekNumber']}
                                            hidden
                                        >
                                            <Input type="hidden" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Название недели (опционально)"
                                            name={[field.name, 'name']}
                                            fieldKey={[field.key, 'name']}
                                        >
                                            <Input
                                                placeholder={`Неделя ${weekIndex + 1}: Название`}
                                            />
                                        </Form.Item>

                                        <Form.List name={[field.name, 'workouts']}>
                                            {(
                                                workoutFields,
                                                { add: addWorkout, remove: removeWorkout }
                                            ) => (
                                                <>
                                                    <div
                                                        className={
                                                            styles.subSectionHeader
                                                        }
                                                    >
                                                        <h5>Тренировки недели</h5>
                                                        <Button
                                                            type="dashed"
                                                            size="small"
                                                            onClick={() =>
                                                                addWorkout({
                                                                    id: `workout-${Date.now()}`,
                                                                    name: `Тренировка ${workoutFields.length + 1}`,
                                                                    exercises: [],
                                                                })
                                                            }
                                                            icon={<PlusCircleOutlined />}
                                                            disabled={
                                                                workoutFields.length >= 7
                                                            }
                                                        >
                                                            Добавить тренировку
                                                        </Button>
                                                        {workoutFields.length >= 7 && (
                                                            <span
                                                                className={
                                                                    styles.limitText
                                                                }
                                                            >
                                                                Максимум 7 тренировок в
                                                                неделю
                                                            </span>
                                                        )}
                                                    </div>

                                                    {workoutFields.map(
                                                        (
                                                            workoutField: FormListField,
                                                            workoutIndex: number
                                                        ) => (
                                                            <Card
                                                                key={workoutField.key}
                                                                size="small"
                                                                title={`Тренировка ${workoutIndex + 1}`}
                                                                className={
                                                                    styles.workoutFormCard
                                                                }
                                                                extra={
                                                                    <MinusCircleOutlined
                                                                        onClick={() =>
                                                                            removeWorkout(
                                                                                workoutField.name
                                                                            )
                                                                        }
                                                                        style={{
                                                                            color: '#ff4d4f',
                                                                        }}
                                                                    />
                                                                }
                                                            >
                                                                <Form.Item
                                                                    {...workoutField}
                                                                    label="Название тренировки"
                                                                    name={[
                                                                        workoutField.name,
                                                                        'name',
                                                                    ]}
                                                                    fieldKey={[
                                                                        workoutField.key,
                                                                        'name',
                                                                    ]}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message:
                                                                                'Введите название тренировки',
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input placeholder="Например: Верх тела, Ноги" />
                                                                </Form.Item>

                                                                <Form.Item
                                                                    label="Описание (опционально)"
                                                                    name={[
                                                                        workoutField.name,
                                                                        'description',
                                                                    ]}
                                                                    fieldKey={[
                                                                        workoutField.key,
                                                                        'description',
                                                                    ]}
                                                                >
                                                                    <TextArea
                                                                        rows={2}
                                                                        placeholder="Описание тренировки..."
                                                                    />
                                                                </Form.Item>

                                                                <Form.Item
                                                                    label="День недели (опционально)"
                                                                    name={[
                                                                        workoutField.name,
                                                                        'dayOfWeek',
                                                                    ]}
                                                                    fieldKey={[
                                                                        workoutField.key,
                                                                        'dayOfWeek',
                                                                    ]}
                                                                >
                                                                    <Select placeholder="Выберите день">
                                                                        <Option value={0}>
                                                                            Понедельник
                                                                        </Option>
                                                                        <Option value={1}>
                                                                            Вторник
                                                                        </Option>
                                                                        <Option value={2}>
                                                                            Среда
                                                                        </Option>
                                                                        <Option value={3}>
                                                                            Четверг
                                                                        </Option>
                                                                        <Option value={4}>
                                                                            Пятница
                                                                        </Option>
                                                                        <Option value={5}>
                                                                            Суббота
                                                                        </Option>
                                                                        <Option value={6}>
                                                                            Воскресенье
                                                                        </Option>
                                                                    </Select>
                                                                </Form.Item>

                                                                <WorkoutExercisesForm
                                                                    weekIndex={weekIndex}
                                                                    workoutIndex={
                                                                        workoutIndex
                                                                    }
                                                                    form={createForm}
                                                                    allExercises={
                                                                        allExercises
                                                                    }
                                                                    onOpenExerciseModal={
                                                                        handleOpenExerciseModal
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

            <Modal
                title="Редактировать шаблон плана тренировок"
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
                    <Form<TrainingPlanFormData>
                        form={editForm}
                        layout="vertical"
                        onFinish={handleEdit}
                    >
                        <Form.Item<TrainingPlanFormData>
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
                            <Input placeholder="Например: Базовый план для начинающих" />
                        </Form.Item>
                        <Form.Item<TrainingPlanFormData>
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
                                placeholder="Опишите цели и особенности шаблона..."
                            />
                        </Form.Item>
                        <div className={styles.formRow}>
                            <Form.Item<TrainingPlanFormData>
                                name="durationWeeks"
                                label="Продолжительность (недель)"
                                normalize={(value) => Number(value)}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Введите продолжительность',
                                    },
                                    {
                                        type: 'number',
                                        min: 1,
                                        max: 52,
                                        message: 'От 1 до 52 недель',
                                    },
                                ]}
                                className={styles.formThird}
                            >
                                <Input type="number" min={1} max={52} />
                            </Form.Item>

                            <Form.Item<TrainingPlanFormData>
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

                            <Form.Item<TrainingPlanFormData>
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
                        <Form.List name="weeks">
                            {(fields, { add, remove }) => (
                                <>
                                    <div className={styles.formSectionHeader}>
                                        <h4>Недели тренировок</h4>
                                        <Button
                                            type="dashed"
                                            onClick={() =>
                                                add({
                                                    weekNumber: fields.length + 1,
                                                    name: `Неделя ${fields.length + 1}`,
                                                    workouts: [],
                                                })
                                            }
                                            icon={<PlusCircleOutlined />}
                                        >
                                            Добавить неделю
                                        </Button>
                                    </div>

                                    {fields.map(
                                        (field: FormListField, weekIndex: number) => (
                                            <Card
                                                key={field.key}
                                                title={`Неделя ${weekIndex + 1}`}
                                                size="small"
                                                className={styles.weekCard}
                                                extra={
                                                    <MinusCircleOutlined
                                                        onClick={() => remove(field.name)}
                                                        style={{ color: '#ff4d4f' }}
                                                    />
                                                }
                                            >
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'weekNumber']}
                                                    fieldKey={[field.key, 'weekNumber']}
                                                    hidden
                                                >
                                                    <Input type="hidden" />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Название недели (опционально)"
                                                    name={[field.name, 'name']}
                                                    fieldKey={[field.key, 'name']}
                                                >
                                                    <Input />
                                                </Form.Item>

                                                <Form.List
                                                    name={[field.name, 'workouts']}
                                                >
                                                    {(
                                                        workoutFields,
                                                        {
                                                            add: addWorkout,
                                                            remove: removeWorkout,
                                                        }
                                                    ) => (
                                                        <>
                                                            <div
                                                                className={
                                                                    styles.subSectionHeader
                                                                }
                                                            >
                                                                <h5>Тренировки недели</h5>
                                                                <Button
                                                                    type="dashed"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        addWorkout({
                                                                            id: `workout-${Date.now()}`,
                                                                            name: `Тренировка ${workoutFields.length + 1}`,
                                                                            exercises: [],
                                                                        })
                                                                    }
                                                                    icon={
                                                                        <PlusCircleOutlined />
                                                                    }
                                                                    disabled={
                                                                        workoutFields.length >=
                                                                        7
                                                                    }
                                                                >
                                                                    Добавить тренировку
                                                                </Button>
                                                            </div>

                                                            {workoutFields.map(
                                                                (
                                                                    workoutField: FormListField,
                                                                    workoutIndex: number
                                                                ) => (
                                                                    <Card
                                                                        key={
                                                                            workoutField.key
                                                                        }
                                                                        size="small"
                                                                        title={`Тренировка ${workoutIndex + 1}`}
                                                                        className={
                                                                            styles.workoutFormCard
                                                                        }
                                                                        extra={
                                                                            <MinusCircleOutlined
                                                                                onClick={() =>
                                                                                    removeWorkout(
                                                                                        workoutField.name
                                                                                    )
                                                                                }
                                                                                style={{
                                                                                    color: '#ff4d4f',
                                                                                }}
                                                                            />
                                                                        }
                                                                    >
                                                                        <Form.Item
                                                                            {...workoutField}
                                                                            label="Название тренировки"
                                                                            name={[
                                                                                workoutField.name,
                                                                                'name',
                                                                            ]}
                                                                            fieldKey={[
                                                                                workoutField.key,
                                                                                'name',
                                                                            ]}
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message:
                                                                                        'Введите название тренировки',
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Input />
                                                                        </Form.Item>

                                                                        <Form.Item
                                                                            label="Описание (опционально)"
                                                                            name={[
                                                                                workoutField.name,
                                                                                'description',
                                                                            ]}
                                                                            fieldKey={[
                                                                                workoutField.key,
                                                                                'description',
                                                                            ]}
                                                                        >
                                                                            <TextArea
                                                                                rows={2}
                                                                            />
                                                                        </Form.Item>

                                                                        <Form.Item
                                                                            label="День недели (опционально)"
                                                                            name={[
                                                                                workoutField.name,
                                                                                'dayOfWeek',
                                                                            ]}
                                                                            fieldKey={[
                                                                                workoutField.key,
                                                                                'dayOfWeek',
                                                                            ]}
                                                                        >
                                                                            <Select>
                                                                                <Option
                                                                                    value={
                                                                                        0
                                                                                    }
                                                                                >
                                                                                    Понедельник
                                                                                </Option>
                                                                                <Option
                                                                                    value={
                                                                                        1
                                                                                    }
                                                                                >
                                                                                    Вторник
                                                                                </Option>
                                                                                <Option
                                                                                    value={
                                                                                        2
                                                                                    }
                                                                                >
                                                                                    Среда
                                                                                </Option>
                                                                                <Option
                                                                                    value={
                                                                                        3
                                                                                    }
                                                                                >
                                                                                    Четверг
                                                                                </Option>
                                                                                <Option
                                                                                    value={
                                                                                        4
                                                                                    }
                                                                                >
                                                                                    Пятница
                                                                                </Option>
                                                                                <Option
                                                                                    value={
                                                                                        5
                                                                                    }
                                                                                >
                                                                                    Суббота
                                                                                </Option>
                                                                                <Option
                                                                                    value={
                                                                                        6
                                                                                    }
                                                                                >
                                                                                    Воскресенье
                                                                                </Option>
                                                                            </Select>
                                                                        </Form.Item>

                                                                        <WorkoutExercisesForm
                                                                            weekIndex={
                                                                                weekIndex
                                                                            }
                                                                            workoutIndex={
                                                                                workoutIndex
                                                                            }
                                                                            form={
                                                                                editForm
                                                                            }
                                                                            allExercises={
                                                                                allExercises
                                                                            }
                                                                            onOpenExerciseModal={
                                                                                handleOpenExerciseModal
                                                                            }
                                                                        />
                                                                    </Card>
                                                                )
                                                            )}
                                                        </>
                                                    )}
                                                </Form.List>
                                            </Card>
                                        )
                                    )}
                                </>
                            )}
                        </Form.List>
                    </Form>
                )}
            </Modal>

            <Modal
                title="Удалить шаблон плана тренировок"
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
                            Длительность: {currentPlan.durationWeeks} недель
                        </p>
                        <p className={styles.deleteWarning}>
                            ⚠️ Это действие нельзя отменить
                        </p>
                    </div>
                )}
            </Modal>

            <Modal
                title="Выбрать упражнение из базы данных"
                open={isAddExerciseModalOpen}
                onCancel={handleCloseExerciseModal}
                width={800}
                footer={null}
                zIndex={2000}
                maskClosable={false}
            >
                <div className={styles.exerciseModalContent}>
                    <div className={styles.exerciseFilters}>
                        <Space size="middle" wrap>
                            <div className={styles.filterItem}>
                                <span className={styles.filterLabel}>Поиск:</span>
                                <Input
                                    placeholder="Поиск по названию или группе мышц..."
                                    allowClear
                                    value={exerciseSearch}
                                    onChange={(e) => setExerciseSearch(e.target.value)}
                                    prefix={<SearchOutlined />}
                                    style={{ width: 250 }}
                                />
                            </div>

                            <div className={styles.filterItem}>
                                <span className={styles.filterLabel}>Группа мышц:</span>
                                <Select
                                    placeholder="Все группы"
                                    style={{ width: 180 }}
                                    allowClear
                                    value={selectedMuscleGroup}
                                    onChange={setSelectedMuscleGroup}
                                >
                                    {muscleGroups.map((group) => (
                                        <Option key={group} value={group}>
                                            {group}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </Space>
                    </div>

                    <div className={styles.exercisesListModal}>
                        {filteredExercises.length > 0 ? (
                            <Row gutter={[16, 16]}>
                                {filteredExercises.map((exercise) => (
                                    <Col span={12} key={exercise.id}>
                                        <Card
                                            size="small"
                                            hoverable
                                            onClick={() =>
                                                handleAddExerciseFromDB(exercise)
                                            }
                                            className={styles.exerciseCard}
                                        >
                                            <div className={styles.exerciseCardContent}>
                                                <div
                                                    className={styles.exerciseCardHeader}
                                                >
                                                    <strong>{exercise.title}</strong>
                                                    <Tag
                                                        color="blue"
                                                        className={styles.smallTag}
                                                    >
                                                        {exercise.muscleGroup}
                                                    </Tag>
                                                </div>
                                                {exercise.description && (
                                                    <p
                                                        className={
                                                            styles.exerciseCardDescription
                                                        }
                                                    >
                                                        {exercise.description.length > 100
                                                            ? `${exercise.description.substring(0, 100)}...`
                                                            : exercise.description}
                                                    </p>
                                                )}
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div className={styles.noExercisesFound}>
                                <p>Упражнения не найдены</p>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};
