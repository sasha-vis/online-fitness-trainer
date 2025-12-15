import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    Card,
    Avatar,
    Button,
    Typography,
    message,
    Space,
    Tabs,
    Breadcrumb,
    Spin,
    Popconfirm, // Добавляем Popconfirm для подтверждения удаления
} from 'antd';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    deleteDoc,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { useTrainerStore } from '@shared/stores/trainer/trainer';
import { useAuthStore } from '@/shared/stores/user/user';
import { WorkoutPlanModal, NutritionPlanModal } from '@/widgets';
import { WorkoutPlanView } from './workout-plan-view';
import { NutritionPlanView } from './nutrition-plan-view';

export const ClientDetail = () => {
    const { clientId } = useParams();
    const { selectedClient, fetchClient, assignTrainer, removeTrainer } =
        useTrainerStore();
    const { user } = useAuthStore();

    const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
    const [nutritionModalVisible, setNutritionModalVisible] = useState(false);
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [nutritionPlan, setNutritionPlan] = useState(null);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [deletingWorkoutPlan, setDeletingWorkoutPlan] = useState(false);
    const [deletingNutritionPlan, setDeletingNutritionPlan] = useState(false);

    useEffect(() => {
        fetchClient(clientId);
        fetchClientPlans();
    }, [clientId]);

    const fetchClientPlans = async () => {
        if (!clientId) return;

        try {
            setLoadingPlans(true);

            // Получаем назначение тренировок
            const workoutAssignmentsRef = collection(db, 'clientTrainingAssignments');
            const workoutQuery = query(
                workoutAssignmentsRef,
                where('clientId', '==', clientId)
            );
            const workoutSnapshot = await getDocs(workoutQuery);

            if (!workoutSnapshot.empty) {
                const assignment = workoutSnapshot.docs[0].data();
                if (assignment.templateId) {
                    const templateRef = doc(
                        db,
                        'trainingPlanTemplates',
                        assignment.templateId
                    );
                    const templateSnap = await getDoc(templateRef);
                    if (templateSnap.exists()) {
                        setWorkoutPlan({
                            id: templateSnap.id,
                            ...templateSnap.data(),
                            assignmentId: workoutSnapshot.docs[0].id,
                            assignedAt: assignment.assignedAt,
                        });
                    }
                }
            } else {
                setWorkoutPlan(null);
            }

            // Получаем назначение питания
            const nutritionAssignmentsRef = collection(db, 'clientNutritionAssignments');
            const nutritionQuery = query(
                nutritionAssignmentsRef,
                where('clientId', '==', clientId)
            );
            const nutritionSnapshot = await getDocs(nutritionQuery);

            if (!nutritionSnapshot.empty) {
                const assignment = nutritionSnapshot.docs[0].data();
                if (assignment.templateId) {
                    const templateRef = doc(
                        db,
                        'nutritionPlanTemplates',
                        assignment.templateId
                    );
                    const templateSnap = await getDoc(templateRef);
                    if (templateSnap.exists()) {
                        setNutritionPlan({
                            id: templateSnap.id,
                            ...templateSnap.data(),
                            assignmentId: nutritionSnapshot.docs[0].id,
                            assignedAt: assignment.assignedAt,
                        });
                    }
                }
            } else {
                setNutritionPlan(null);
            }
        } catch (error) {
            console.error('Error fetching client plans:', error);
            message.error('Не удалось загрузить планы клиента');
        } finally {
            setLoadingPlans(false);
        }
    };

    // Функция удаления плана тренировок
    const handleDeleteWorkoutPlan = async () => {
        if (!workoutPlan?.assignmentId) return;

        try {
            setDeletingWorkoutPlan(true);

            // Удаляем запись из clientTrainingAssignments
            const assignmentRef = doc(
                db,
                'clientTrainingAssignments',
                workoutPlan.assignmentId
            );
            await deleteDoc(assignmentRef);

            // Обновляем состояние
            setWorkoutPlan(null);

            message.success('План тренировок удален');
        } catch (error) {
            console.error('Error deleting workout plan:', error);
            message.error('Не удалось удалить план тренировок');
        } finally {
            setDeletingWorkoutPlan(false);
        }
    };

    // Функция удаления плана питания
    const handleDeleteNutritionPlan = async () => {
        if (!nutritionPlan?.assignmentId) return;

        try {
            setDeletingNutritionPlan(true);

            // Удаляем запись из clientNutritionAssignments
            const assignmentRef = doc(
                db,
                'clientNutritionAssignments',
                nutritionPlan.assignmentId
            );
            await deleteDoc(assignmentRef);

            // Обновляем состояние
            setNutritionPlan(null);

            message.success('План питания удален');
        } catch (error) {
            console.error('Error deleting nutrition plan:', error);
            message.error('Не удалось удалить план питания');
        } finally {
            setDeletingNutritionPlan(false);
        }
    };

    if (!selectedClient) return 'Loading...';

    const isTrainer = user && user.id && selectedClient.trainerId === user.id;

    const handleAssignTrainer = async () => {
        await assignTrainer(selectedClient.id, user);
        message.success('Вы назначены тренером клиента');
        fetchClient(clientId);
    };

    const handleRemoveTrainer = async () => {
        await removeTrainer(selectedClient.id);
        message.success('Тренер удалён');
        fetchClient(clientId);
    };

    const handleWorkoutPlanSelect = (plan) => {
        setWorkoutModalVisible(false);
        fetchClientPlans();
    };

    const handleNutritionPlanSelect = (plan) => {
        setNutritionModalVisible(false);
        fetchClientPlans();
    };

    return (
        <>
            <Breadcrumb
                style={{ marginBottom: '16px' }}
                items={[
                    {
                        title: (
                            <Link to="/trainer/clients">
                                {'< Вернуться к списку клиентов'}
                            </Link>
                        ),
                    },
                ]}
            />
            <Card style={{ width: 800, margin: 'auto' }}>
                <Avatar size={80} icon={<UserOutlined />} />
                <Typography.Title level={2}>{selectedClient.name}</Typography.Title>
                <Typography.Text>{selectedClient.email}</Typography.Text>

                <div style={{ marginTop: 20 }}>
                    {selectedClient.trainerId ? (
                        <Space>
                            <Typography.Text>
                                Тренер: {selectedClient.trainerName} (
                                {selectedClient.trainerEmail})
                            </Typography.Text>
                            {isTrainer && (
                                <Button danger onClick={handleRemoveTrainer}>
                                    Удалить клиента
                                </Button>
                            )}
                        </Space>
                    ) : (
                        <Button type="primary" onClick={handleAssignTrainer}>
                            Стать тренером
                        </Button>
                    )}
                </div>

                <div style={{ marginTop: 30 }}>
                    <Tabs defaultActiveKey="workout">
                        <Tabs.TabPane tab="Тренировки" key="workout">
                            <div style={{ marginBottom: 16 }}>
                                <Space>
                                    <Button
                                        type="primary"
                                        onClick={() => setWorkoutModalVisible(true)}
                                    >
                                        {workoutPlan
                                            ? 'Изменить план тренировок'
                                            : 'Назначить план тренировок'}
                                    </Button>

                                    {workoutPlan && (
                                        <Popconfirm
                                            title="Удалить план тренировок"
                                            description="Вы уверены, что хотите удалить план тренировок у клиента?"
                                            onConfirm={handleDeleteWorkoutPlan}
                                            okText="Да"
                                            cancelText="Нет"
                                        >
                                            <Button
                                                danger
                                                icon={<DeleteOutlined />}
                                                loading={deletingWorkoutPlan}
                                                disabled={deletingWorkoutPlan}
                                            >
                                                Удалить план
                                            </Button>
                                        </Popconfirm>
                                    )}
                                </Space>
                            </div>

                            {loadingPlans ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <Spin />
                                </div>
                            ) : (
                                <WorkoutPlanView plan={workoutPlan} />
                            )}
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Питание" key="nutrition">
                            <div style={{ marginBottom: 16 }}>
                                <Space>
                                    <Button
                                        type="primary"
                                        onClick={() => setNutritionModalVisible(true)}
                                    >
                                        {nutritionPlan
                                            ? 'Изменить план питания'
                                            : 'Назначить план питания'}
                                    </Button>

                                    {nutritionPlan && (
                                        <Popconfirm
                                            title="Удалить план питания"
                                            description="Вы уверены, что хотите удалить план питания у клиента?"
                                            onConfirm={handleDeleteNutritionPlan}
                                            okText="Да"
                                            cancelText="Нет"
                                        >
                                            <Button
                                                danger
                                                icon={<DeleteOutlined />}
                                                loading={deletingNutritionPlan}
                                                disabled={deletingNutritionPlan}
                                            >
                                                Удалить план
                                            </Button>
                                        </Popconfirm>
                                    )}
                                </Space>
                            </div>

                            {loadingPlans ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <Spin />
                                </div>
                            ) : (
                                <NutritionPlanView plan={nutritionPlan} />
                            )}
                        </Tabs.TabPane>
                    </Tabs>
                </div>

                <WorkoutPlanModal
                    visible={workoutModalVisible}
                    onClose={() => setWorkoutModalVisible(false)}
                    onSelect={handleWorkoutPlanSelect}
                />

                <NutritionPlanModal
                    visible={nutritionModalVisible}
                    onClose={() => setNutritionModalVisible(false)}
                    onSelect={handleNutritionPlanSelect}
                />
            </Card>
        </>
    );
};
