import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, Tag, Space, Collapse, List } from 'antd';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuthStore } from '@/shared/stores/user/user';
import { AppleOutlined, FireOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const Nutrition = () => {
    const { user } = useAuthStore();
    const [nutritionPlan, setNutritionPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNutritionPlan();
    }, []);

    const fetchNutritionPlan = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);

            // Получаем назначение питания
            const nutritionAssignmentsRef = collection(db, 'clientNutritionAssignments');
            const nutritionQuery = query(
                nutritionAssignmentsRef,
                where('clientId', '==', user.id)
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
            console.error('Error fetching nutrition plan:', error);
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

    if (!nutritionPlan) {
        return (
            <div style={{ padding: '24px' }}>
                <Card>
                    <Title level={3} style={{ textAlign: 'center' }}>
                        Тренер пока не отправлял вам ваш план питания
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

    const days = Array.isArray(nutritionPlan.days) ? nutritionPlan.days : [];

    const collapseItems = days.map((day, dayIndex) => ({
        key: dayIndex,
        label: `${day.name || ''}`,
        children: (
            <div>
                {Array.isArray(day.meals) && day.meals.length > 0 ? (
                    day.meals.map((meal, mealIndex) => {
                        const mealCalories = Array.isArray(meal.dishes)
                            ? meal.dishes.reduce(
                                  (total, dish) => total + (dish.calories || 0),
                                  0
                              )
                            : 0;

                        return (
                            <Card
                                key={mealIndex}
                                size="small"
                                style={{ marginBottom: 12 }}
                                title={
                                    <Space>
                                        <AppleOutlined />
                                        <Text strong>
                                            {meal.name || `Прием пищи ${mealIndex + 1}`}
                                        </Text>
                                        <Tag>{meal.timeOfDay || ''}</Tag>
                                        {mealCalories > 0 && (
                                            <Tag color="orange" icon={<FireOutlined />}>
                                                {mealCalories} ккал
                                            </Tag>
                                        )}
                                    </Space>
                                }
                            >
                                {meal.description && (
                                    <Text
                                        type="secondary"
                                        style={{ display: 'block', marginBottom: 12 }}
                                    >
                                        {meal.description}
                                    </Text>
                                )}

                                {Array.isArray(meal.dishes) && meal.dishes.length > 0 ? (
                                    <List
                                        size="small"
                                        dataSource={meal.dishes}
                                        renderItem={(dish, dishIndex) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={
                                                        <Space>
                                                            <Text>
                                                                {dish.dishTitle ||
                                                                    dish.name ||
                                                                    'Блюдо'}
                                                            </Text>
                                                            {dish.portion && (
                                                                <Tag>{dish.portion}</Tag>
                                                            )}
                                                        </Space>
                                                    }
                                                    description={
                                                        <Space size="middle">
                                                            {dish.calories > 0 && (
                                                                <Text type="secondary">
                                                                    <FireOutlined />{' '}
                                                                    {dish.calories} ккал
                                                                </Text>
                                                            )}
                                                            {dish.protein > 0 && (
                                                                <Text type="secondary">
                                                                    Б: {dish.protein}г
                                                                </Text>
                                                            )}
                                                            {dish.carbs > 0 && (
                                                                <Text type="secondary">
                                                                    У: {dish.carbs}г
                                                                </Text>
                                                            )}
                                                            {dish.fat > 0 && (
                                                                <Text type="secondary">
                                                                    Ж: {dish.fat}г
                                                                </Text>
                                                            )}
                                                        </Space>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <Text type="secondary">Блюда не добавлены</Text>
                                )}
                            </Card>
                        );
                    })
                ) : (
                    <Text type="secondary">Приемы пищи не добавлены</Text>
                )}
            </div>
        ),
    }));

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Title level={2}>Мой план питания</Title>

            <Card style={{ marginBottom: 24 }}>
                <Title level={3}>{nutritionPlan.name || 'План питания'}</Title>
                {nutritionPlan.description && (
                    <Text type="secondary">{nutritionPlan.description}</Text>
                )}

                <div style={{ marginTop: 16 }}>
                    <Space size="large" wrap>
                        {nutritionPlan.goal && (
                            <div>
                                <Text strong>Цель: </Text>
                                <Tag color="green">{nutritionPlan.goal}</Tag>
                            </div>
                        )}
                        {nutritionPlan.difficulty && (
                            <div>
                                <Text strong>Уровень: </Text>
                                <Tag
                                    color={
                                        nutritionPlan.difficulty === 'Начинающий'
                                            ? 'green'
                                            : nutritionPlan.difficulty === 'Средний'
                                              ? 'orange'
                                              : 'red'
                                    }
                                >
                                    {nutritionPlan.difficulty}
                                </Tag>
                            </div>
                        )}
                        {nutritionPlan.durationDays && (
                            <div>
                                <Text strong>Длительность: </Text>
                                <Tag color="blue">{nutritionPlan.durationDays} дней</Tag>
                            </div>
                        )}
                        {days.length > 0 && (
                            <div>
                                <Text strong>Всего дней: </Text>
                                <Tag>{days.length}</Tag>
                            </div>
                        )}
                    </Space>
                </div>
            </Card>

            {collapseItems.length > 0 ? (
                <Collapse defaultActiveKey={[0]} items={collapseItems} />
            ) : (
                <Card>
                    <Text type="secondary">Дни питания не добавлены в план</Text>
                </Card>
            )}
        </div>
    );
};
