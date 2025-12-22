import { Modal, Button, List, message, Spin } from 'antd';
import { useState, useEffect } from 'react';
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuthStore } from '@/shared/stores/user/user';
import { useParams } from 'react-router-dom';

export const WorkoutPlanModal = ({ visible, onClose, onSelect }) => {
    const { clientId } = useParams();
    const { user } = useAuthStore();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [currentAssignmentId, setCurrentAssignmentId] = useState(null);
    const [currentTemplateId, setCurrentTemplateId] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            if (!visible) return;

            try {
                setLoading(true);

                const assignmentsRef = collection(db, 'clientTrainingAssignments');
                const assignmentQuery = query(
                    assignmentsRef,
                    where('clientId', '==', clientId)
                );
                const assignmentSnapshot = await getDocs(assignmentQuery);

                if (!assignmentSnapshot.empty) {
                    const assignment = assignmentSnapshot.docs[0];
                    setCurrentAssignmentId(assignment.id);
                    setCurrentTemplateId(assignment.data().templateId);
                } else {
                    setCurrentAssignmentId(null);
                    setCurrentTemplateId(null);
                }

                const plansRef = collection(db, 'trainingPlanTemplates');
                const snapshot = await getDocs(plansRef);
                const plansData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPlans(plansData);
            } catch (error) {
                console.error('Error fetching plans:', error);
                message.error('Не удалось загрузить шаблоны тренировок');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, [visible, clientId]);

    const handleSelect = async (plan) => {
        if (!clientId || !user?.id) {
            message.error('Недостаточно данных для назначения плана');
            return;
        }

        try {
            setAssigning(true);

            if (currentAssignmentId) {
                const oldAssignmentRef = doc(
                    db,
                    'clientTrainingAssignments',
                    currentAssignmentId
                );
                await deleteDoc(oldAssignmentRef);
            }

            const assignmentRef = collection(db, 'clientTrainingAssignments');
            await addDoc(assignmentRef, {
                clientId: clientId,
                trainerId: user.id,
                templateId: plan.id,
                planName: plan.name,
                assignedAt: new Date(),
                status: 'active',
                previousAssignmentId: currentAssignmentId,
            });

            onSelect(plan);

            message.success('План тренировок назначен клиенту');
            onClose();
        } catch (error) {
            console.error('Error assigning plan:', error);
            message.error('Не удалось назначить план тренировок');
        } finally {
            setAssigning(false);
        }
    };

    return (
        <Modal
            title="Выберите шаблон тренировок"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {currentAssignmentId && (
                        <div
                            style={{
                                marginBottom: 16,
                                padding: '8px 12px',
                                backgroundColor: '#fffbe6',
                                border: '1px solid #ffe58f',
                                borderRadius: 4,
                            }}
                        >
                            <span style={{ color: '#faad14' }}>
                                ⚠️ У клиента уже есть активный план. Новый план заменит
                                текущий.
                            </span>
                        </div>
                    )}

                    <List
                        dataSource={plans}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="primary"
                                        onClick={() => handleSelect(item)}
                                        key="select"
                                        loading={assigning}
                                        disabled={assigning}
                                    >
                                        {currentAssignmentId ? 'Заменить' : 'Назначить'}
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={item.name}
                                    description={
                                        <div>
                                            <div>Цель: {item.goal}</div>
                                            <div>Сложность: {item.difficulty}</div>
                                            <div>
                                                Длительность: {item.durationWeeks} недель
                                            </div>
                                            {currentTemplateId === item.id && (
                                                <div
                                                    style={{
                                                        color: '#52c41a',
                                                        marginTop: 4,
                                                    }}
                                                >
                                                    ✓ Текущий план
                                                </div>
                                            )}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </>
            )}
        </Modal>
    );
};
