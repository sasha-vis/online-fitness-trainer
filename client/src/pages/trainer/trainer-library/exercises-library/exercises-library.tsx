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
} from '@ant-design/icons';
import { useState, useMemo, useEffect } from 'react';
import styles from './exercises-library.module.scss';
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

interface Exercise {
    id: string;
    title: string;
    muscleGroup: string;
    description?: string;
    videoUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const getMuscleGroupsFromExercises = (exercises: Exercise[]) => {
    return Array.from(new Set(exercises.map((ex) => ex.muscleGroup))).sort();
};

export const ExercisesLibrary = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
    const [activeKeys, setActiveKeys] = useState<string[]>([]);
    const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
    const [form] = Form.useForm();

    const fetchExercises = async () => {
        try {
            setLoading(true);
            const exercisesRef = collection(db, 'exercises');
            const q = query(exercisesRef, orderBy('createdAt', 'desc'));
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
                    createdAt: data.createdAt?.toDate(),
                    updatedAt: data.updatedAt?.toDate(),
                });
            });

            setExercises(exercisesData);
            setMuscleGroups(getMuscleGroupsFromExercises(exercisesData));
        } catch (error) {
            console.error('Ошибка при загрузке упражнений:', error);
            message.error('Не удалось загрузить упражнения');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    const filteredExercises = useMemo(() => {
        return exercises.filter((exercise) => {
            const matchesSearch =
                searchText === '' ||
                exercise.title.toLowerCase().includes(searchText.toLowerCase());

            const matchesMuscleGroup =
                selectedMuscleGroup === null ||
                exercise.muscleGroup === selectedMuscleGroup;

            return matchesSearch && matchesMuscleGroup;
        });
    }, [exercises, searchText, selectedMuscleGroup]);

    const handleAccordionChange = (keys: string | string[]) => {
        setActiveKeys(Array.isArray(keys) ? keys : [keys]);
    };

    const openVideo = (url: string) => {
        window.open(url.replace('/embed/', '/watch?v='), '_blank');
    };

    const showCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(true);
    };

    const showEditModal = (exercise: Exercise) => {
        setCurrentExercise(exercise);
        form.setFieldsValue({
            title: exercise.title,
            muscleGroup: exercise.muscleGroup,
            description: exercise.description || '',
            videoUrl: exercise.videoUrl || '',
        });
        setIsEditModalOpen(true);
    };

    const showDeleteModal = (exercise: Exercise) => {
        setCurrentExercise(exercise);
        setIsDeleteModalOpen(true);
    };

    const handleCancel = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setCurrentExercise(null);
        form.resetFields();
        setSubmitting(false);
    };

    const handleCreate = async (values: Exercise) => {
        try {
            setSubmitting(true);
            const exercisesRef = collection(db, 'exercises');

            const newExerciseData: Omit<Exercise, 'id'> = {
                title: values.title,
                muscleGroup: values.muscleGroup,
                description: values.description || '',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            if (values.videoUrl && values.videoUrl.trim() !== '') {
                newExerciseData.videoUrl = values.videoUrl;
            }

            const docRef = await addDoc(exercisesRef, newExerciseData);

            const createdExercise: Exercise = {
                id: docRef.id,
                ...newExerciseData,
                videoUrl: newExerciseData.videoUrl || '',
            };

            setExercises((prev) => [createdExercise, ...prev]);

            const updatedMuscleGroups = getMuscleGroupsFromExercises([
                createdExercise,
                ...exercises,
            ]);
            setMuscleGroups(updatedMuscleGroups);

            message.success('Упражнение создано!');
            handleCancel();
        } catch (error) {
            console.error('Ошибка при создании упражнения:', error);
            message.error('Не удалось создать упражнение');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (values: Exercise) => {
        if (!currentExercise) return;

        try {
            setSubmitting(true);
            const exerciseRef = doc(db, 'exercises', currentExercise.id);

            const updatedData: Omit<Exercise, 'id'> = {
                title: values.title,
                muscleGroup: values.muscleGroup,
                description: values.description || '',
                updatedAt: new Date(),
            };

            if (values.videoUrl && values.videoUrl.trim() !== '') {
                updatedData.videoUrl = values.videoUrl;
            } else {
                updatedData.videoUrl = '';
            }

            await updateDoc(exerciseRef, updatedData);

            setExercises((prev) =>
                prev.map((ex) =>
                    ex.id === currentExercise.id
                        ? {
                              ...ex,
                              ...updatedData,
                              videoUrl: updatedData.videoUrl || '',
                          }
                        : ex
                )
            );

            const updatedMuscleGroups = getMuscleGroupsFromExercises(
                exercises.map((ex) =>
                    ex.id === currentExercise.id
                        ? {
                              ...ex,
                              ...updatedData,
                              videoUrl: updatedData.videoUrl || '',
                          }
                        : ex
                )
            );
            setMuscleGroups(updatedMuscleGroups);

            message.success('Упражнение обновлено!');
            handleCancel();
        } catch (error) {
            console.error('Ошибка при обновлении упражнения:', error);
            message.error('Не удалось обновить упражнение');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!currentExercise) return;

        try {
            setSubmitting(true);
            const exerciseRef = doc(db, 'exercises', currentExercise.id);
            await deleteDoc(exerciseRef);

            setExercises((prev) => prev.filter((ex) => ex.id !== currentExercise.id));

            const updatedMuscleGroups = getMuscleGroupsFromExercises(
                exercises.filter((ex) => ex.id !== currentExercise.id)
            );
            setMuscleGroups(updatedMuscleGroups);

            message.success('Упражнение удалено!');
            handleCancel();
        } catch (error) {
            console.error('Ошибка при удалении упражнения:', error);
            message.error('Не удалось удалить упражнение');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetFilters = () => {
        setSearchText('');
        setSelectedMuscleGroup(null);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" />
                <p>Загрузка упражнений...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Библиотека упражнений</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                    disabled={loading}
                >
                    Добавить упражнение
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

                    <Button
                        onClick={handleResetFilters}
                        disabled={!searchText && !selectedMuscleGroup}
                    >
                        Сбросить фильтры
                    </Button>
                </Space>

                <div className={styles.filterStats}>
                    Найдено упражнений: {filteredExercises.length}
                    {selectedMuscleGroup && (
                        <span className={styles.activeFilter}>
                            • Группа: {selectedMuscleGroup}
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.accordionContainer}>
                {filteredExercises.length > 0 ? (
                    <Collapse
                        activeKey={activeKeys}
                        onChange={handleAccordionChange}
                        expandIcon={({ isActive }) => (
                            <CaretRightOutlined rotate={isActive ? 90 : 0} />
                        )}
                        className={styles.exercisesAccordion}
                    >
                        {filteredExercises.map((exercise) => (
                            <Panel
                                header={
                                    <div className={styles.panelHeader}>
                                        <div className={styles.exerciseHeader}>
                                            <div className={styles.exerciseTitle}>
                                                {exercise.title}
                                            </div>
                                            <div className={styles.exerciseTags}>
                                                <Tag
                                                    color="blue"
                                                    className={styles.muscleGroupTag}
                                                >
                                                    {exercise.muscleGroup}
                                                </Tag>
                                            </div>
                                        </div>
                                        <div className={styles.exerciseActions}>
                                            {exercise.videoUrl && (
                                                <Tooltip title="Посмотреть видео">
                                                    <Button
                                                        type="text"
                                                        icon={<YoutubeOutlined />}
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openVideo(exercise.videoUrl!);
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
                                                    showEditModal(exercise);
                                                }}
                                            />
                                            <Button
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                type="text"
                                                danger
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showDeleteModal(exercise);
                                                }}
                                            />
                                        </div>
                                    </div>
                                }
                                key={exercise.id}
                                className={styles.exercisePanel}
                            >
                                <div className={styles.panelContent}>
                                    {!exercise.description && !exercise.videoUrl && (
                                        <div>Дополнительных данных нет</div>
                                    )}

                                    {exercise.description && (
                                        <div className={styles.descriptionSection}>
                                            <h4 className={styles.sectionTitle}>
                                                <InfoCircleOutlined /> Описание
                                            </h4>
                                            <p className={styles.exerciseDescription}>
                                                {exercise.description}
                                            </p>
                                        </div>
                                    )}

                                    {exercise.videoUrl && (
                                        <div className={styles.videoSection}>
                                            <h4 className={styles.sectionTitle}>
                                                <YoutubeOutlined /> Видео
                                            </h4>
                                            <div className={styles.videoContainer}>
                                                <iframe
                                                    width="100%"
                                                    height="315"
                                                    src={exercise.videoUrl}
                                                    title={`Видео: ${exercise.title}`}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                                <Button
                                                    type="link"
                                                    onClick={() =>
                                                        openVideo(exercise.videoUrl!)
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
                        <Button onClick={handleResetFilters}>
                            Показать все упражнения
                        </Button>
                    </div>
                )}
            </div>

            <Modal
                title="Создать новое упражнение"
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
                        name="title"
                        label="Название упражнения"
                        rules={[{ required: true, message: 'Введите название' }]}
                    >
                        <Input placeholder="Например: Жим штанги лежа" />
                    </Form.Item>

                    <Form.Item
                        name="muscleGroup"
                        label="Группа мышц"
                        rules={[{ required: true, message: 'Выберите группу мышц' }]}
                    >
                        <Select placeholder="Выберите группу мышц">
                            {muscleGroups.map((group) => (
                                <Option key={group} value={group}>
                                    {group}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="videoUrl"
                        label="Ссылка на видео (YouTube)"
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
                            placeholder="Описание техники выполнения, советы..."
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Редактировать упражнение"
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
                {currentExercise && (
                    <Form form={form} layout="vertical" onFinish={handleEdit}>
                        <Form.Item
                            name="title"
                            label="Название упражнения"
                            rules={[{ required: true, message: 'Введите название' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="muscleGroup"
                            label="Группа мышц"
                            rules={[{ required: true, message: 'Выберите группу мышц' }]}
                        >
                            <Select>
                                {muscleGroups.map((group) => (
                                    <Option key={group} value={group}>
                                        {group}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="videoUrl" label="Ссылка на видео (YouTube)">
                            <Input />
                        </Form.Item>

                        <Form.Item name="description" label="Описание">
                            <TextArea rows={4} />
                        </Form.Item>
                    </Form>
                )}
            </Modal>

            <Modal
                title="Удалить упражнение"
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
                {currentExercise && (
                    <div className={styles.deleteContent}>
                        <p>Вы уверены, что хотите удалить упражнение:</p>
                        <h3 className={styles.deleteExerciseTitle}>
                            {currentExercise.title}
                        </h3>
                        <p className={styles.deleteExerciseDetails}>
                            Группа: {currentExercise.muscleGroup}
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
