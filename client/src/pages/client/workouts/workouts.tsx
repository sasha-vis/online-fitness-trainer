import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, Tag, Space, Collapse } from 'antd';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuthStore } from '@/shared/stores/user/user';
import { PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const Workouts = () => {
    const { user } = useAuthStore();
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkoutPlan();
    }, []);

    const fetchWorkoutPlan = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);

            const workoutAssignmentsRef = collection(db, 'clientTrainingAssignments');
            const workoutQuery = query(
                workoutAssignmentsRef,
                where('clientId', '==', user.id)
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
        } catch (error) {
            console.error('Error fetching workout plan:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!workoutPlan) {
        return (
            <div style={{ padding: '24px' }}>
                <Card>
                    <Title level={3} style={{ textAlign: 'center' }}>
                        Тренер пока не отправлял вам ваш план тренировок
                    </Title>
                    <Text
                        type="secondary"
                        style={{
                            display: 'block',
                            textAlign: 'center',
                            marginTop: '16px',
                        }}
                    >
                        Пожалуйста, подождите или спросите тренера в чате.
                    </Text>
                </Card>
            </div>
        );
    }

    const weeks = Array.isArray(workoutPlan.weeks) ? workoutPlan.weeks : [];
    const totalWorkouts = weeks.reduce((total, week) => {
        return total + (Array.isArray(week.workouts) ? week.workouts.length : 0);
    }, 0);

    const collapseItems = weeks.map((week, weekIndex) => ({
        key: weekIndex,
        label: `${week.name || ''}`,
        children: (
            <div>
                {Array.isArray(week.workouts) && week.workouts.length > 0 ? (
                    week.workouts.map((workout, workoutIndex) => (
                        <Card
                            key={workoutIndex}
                            size="small"
                            style={{ marginBottom: 12 }}
                            title={
                                <Space>
                                    <Text strong>{workout.name}</Text>
                                </Space>
                            }
                        >
                            {workout.description && (
                                <Text
                                    type="secondary"
                                    style={{ display: 'block', marginBottom: 12 }}
                                >
                                    {workout.description}
                                </Text>
                            )}

                            {Array.isArray(workout.exercises) &&
                            workout.exercises.length > 0 ? (
                                workout.exercises.map((exercise, exIndex) => (
                                    <div
                                        key={exIndex}
                                        style={{
                                            marginBottom: 12,
                                            padding: 8,
                                            backgroundColor: '#fafafa',
                                            borderRadius: 4,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Text strong>
                                                {exercise.exerciseTitle || exercise.name}
                                            </Text>
                                            {exercise.videoUrl && (
                                                <a
                                                    href={exercise.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <PlayCircleOutlined /> Видео
                                                </a>
                                            )}
                                        </div>
                                        <div style={{ marginTop: 4 }}>
                                            <Tag>{exercise.muscleGroup}</Tag>
                                            <Tag>
                                                {exercise.sets} × {exercise.reps}
                                            </Tag>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Text type="secondary">Упражнения не добавлены</Text>
                            )}
                        </Card>
                    ))
                ) : (
                    <Text type="secondary">Тренировки не добавлены</Text>
                )}
            </div>
        ),
    }));

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Title level={2}>Мой план тренировок</Title>

            <Card style={{ marginBottom: 24 }}>
                <Title level={3}>{workoutPlan.name || 'План тренировок'}</Title>
                {workoutPlan.description && (
                    <Text type="secondary">{workoutPlan.description}</Text>
                )}

                <div style={{ marginTop: 16 }}>
                    <Space size="large" wrap>
                        {workoutPlan.goal && (
                            <div>
                                <Text strong>Цель: </Text>
                                <Tag color="blue">{workoutPlan.goal}</Tag>
                            </div>
                        )}
                        {workoutPlan.difficulty && (
                            <div>
                                <Text strong>Уровень: </Text>
                                <Tag
                                    color={
                                        workoutPlan.difficulty === 'Начинающий'
                                            ? 'green'
                                            : workoutPlan.difficulty === 'Средний'
                                              ? 'orange'
                                              : 'red'
                                    }
                                >
                                    {workoutPlan.difficulty}
                                </Tag>
                            </div>
                        )}
                        {workoutPlan.durationWeeks && (
                            <div>
                                <Text strong>Длительность: </Text>
                                <Tag color="purple">
                                    {workoutPlan.durationWeeks} недель
                                </Tag>
                            </div>
                        )}
                        {totalWorkouts > 0 && (
                            <div>
                                <Text strong>Всего тренировок: </Text>
                                <Tag>{totalWorkouts}</Tag>
                            </div>
                        )}
                    </Space>
                </div>
            </Card>

            {collapseItems.length > 0 ? (
                <Collapse defaultActiveKey={[0]} items={collapseItems} />
            ) : (
                <Card>
                    <Text type="secondary">Тренировки не добавлены в план</Text>
                </Card>
            )}
        </div>
    );
};
