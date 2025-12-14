import React, { useState, useEffect, useMemo } from 'react';
import {
    Card,
    List,
    Tag,
    Spin,
    Radio,
    Empty,
    Typography,
    Collapse,
    Space,
    Statistic,
    Row,
    Col,
    Alert,
    Divider,
} from 'antd';
import {
    CalendarOutlined,
    ClockCircleOutlined,
    FireOutlined,
    AppleOutlined,
} from '@ant-design/icons';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import {
    FilterType,
    NutritionPlanTemplate,
    ClientNutritionAssignment,
    DayPlan,
    Meal,
} from './api/types';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

const getDaysDifference = (date1: Date, date2: Date): number => {
    const diffTime = date1.getTime() - date2.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const Nutrition: React.FC = () => {
    const [uid, setUid] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>('today');
    const [nutritionPlan, setNutritionPlan] = useState<NutritionPlanTemplate | null>(
        null
    );
    const [assignment, setAssignment] = useState<ClientNutritionAssignment | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
            } else {
                setUid(null);
                setLoading(false);
                setError('Please sign in to view your nutrition plan');
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchNutritionPlan = async () => {
            try {
                setLoading(true);
                setError(null);

                const assignmentsRef = collection(db, 'clientNutritionAssignments');
                const assignmentQuery = query(
                    assignmentsRef,
                    where('clientId', '==', uid)
                );
                const assignmentSnapshot = await getDocs(assignmentQuery);

                if (assignmentSnapshot.empty) {
                    setError('No nutrition plan assigned to this client');
                    setLoading(false);
                    return;
                }

                const assignmentDoc = assignmentSnapshot.docs[0];
                const assignmentData = {
                    id: assignmentDoc.id,
                    ...assignmentDoc.data(),
                } as ClientNutritionAssignment;

                setAssignment(assignmentData);

                const templateRef = doc(
                    db,
                    'nutritionPlanTemplates',
                    assignmentData.templateId
                );
                const templateSnapshot = await getDoc(templateRef);

                if (!templateSnapshot.exists()) {
                    setError('Nutrition plan template not found');
                    setLoading(false);
                    return;
                }

                const templateData = {
                    id: templateSnapshot.id,
                    ...templateSnapshot.data(),
                } as NutritionPlanTemplate;

                setNutritionPlan(templateData);
            } catch (err) {
                console.error('Error fetching nutrition plan:', err);
                setError('Failed to load nutrition plan. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (uid) {
            fetchNutritionPlan();
        }
    }, [uid]);

    const filteredDays = useMemo(() => {
        if (!nutritionPlan?.days) return [];

        const today = new Date();
        const startDate = assignment?.startDate
            ? new Date(assignment.startDate.toDate() || assignment.startDate)
            : getStartOfWeek(new Date());

        const daysSinceStart = getDaysDifference(today, startDate);
        const totalDays = nutritionPlan.days.length;

        switch (filter) {
            case 'today': {
                const currentDayIndex =
                    ((daysSinceStart % totalDays) + totalDays) % totalDays;
                const todayPlan = nutritionPlan.days.find(
                    (d) => d.day === currentDayIndex + 1
                );
                return todayPlan ? [todayPlan] : [nutritionPlan.days[0]];
            }

            case 'week': {
                const currentWeekStart = getStartOfWeek(today);
                const daysFromWeekStart = getDaysDifference(today, currentWeekStart);
                const weekDays: DayPlan[] = [];

                for (let i = 0; i < 7; i++) {
                    const dayIndex = (daysSinceStart - daysFromWeekStart + i) % totalDays;
                    const normalizedIndex =
                        ((dayIndex % totalDays) + totalDays) % totalDays;
                    const dayPlan = nutritionPlan.days.find(
                        (d) => d.day === normalizedIndex + 1
                    );
                    if (dayPlan) {
                        weekDays.push({
                            ...dayPlan,
                            day: i + 1,
                        });
                    }
                }
                return weekDays;
            }

            case 'month': {
                return nutritionPlan.days;
            }

            default:
                return nutritionPlan.days;
        }
    }, [nutritionPlan, filter, assignment]);

    const calculateDayTotals = (day: DayPlan) => {
        let calories = 0;
        let protein = 0;
        let carbs = 0;
        let fat = 0;

        day.meals.forEach((meal) => {
            meal.dishes.forEach((dish) => {
                calories += dish.calories || 0;
                protein += dish.protein || 0;
                carbs += dish.carbs || 0;
                fat += dish.fat || 0;
            });
        });

        return { calories, protein, carbs, fat };
    };

    const renderMealCard = (meal: Meal) => {
        const mealTotals = meal.dishes.reduce(
            (acc, dish) => ({
                calories: acc.calories + (dish.calories || 0),
                protein: acc.protein + (dish.protein || 0),
                carbs: acc.carbs + (dish.carbs || 0),
                fat: acc.fat + (dish.fat || 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        return (
            <Card
                key={meal.id}
                size="small"
                style={{ marginBottom: 12 }}
                title={
                    <Space>
                        <ClockCircleOutlined />
                        <Text strong>{meal.name}</Text>
                        <Tag color="blue">{meal.timeOfDay}</Tag>
                    </Space>
                }
                extra={
                    <Tag color="orange" icon={<FireOutlined />}>
                        {mealTotals.calories} kcal
                    </Tag>
                }
            >
                {meal.description && (
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                        {meal.description}
                    </Text>
                )}

                <List
                    size="small"
                    dataSource={meal.dishes.sort((a, b) => a.order - b.order)}
                    renderItem={(dish) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <AppleOutlined
                                        style={{ fontSize: 20, color: '#52c41a' }}
                                    />
                                }
                                title={
                                    <Space>
                                        <Text>{dish.dishTitle || dish.name}</Text>
                                        <Tag>{dish.portion}</Tag>
                                    </Space>
                                }
                                description={
                                    <Space size="middle">
                                        <Text type="secondary">
                                            <FireOutlined /> {dish.calories} kcal
                                        </Text>
                                        <Text type="secondary">P: {dish.protein}g</Text>
                                        <Text type="secondary">C: {dish.carbs}g</Text>
                                        <Text type="secondary">F: {dish.fat}g</Text>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        );
    };

    const renderDayPanel = (day: DayPlan) => {
        const totals = calculateDayTotals(day);

        return (
            <Panel
                key={day.day}
                header={
                    <Row align="middle" justify="space-between" style={{ width: '100%' }}>
                        <Col>
                            <Space>
                                <CalendarOutlined />
                                <Text strong>
                                    Day {day.day}: {day.name}
                                </Text>
                            </Space>
                        </Col>
                        <Col>
                            <Space size="large">
                                <Statistic
                                    title="Calories"
                                    value={totals.calories}
                                    suffix="kcal"
                                    valueStyle={{ fontSize: 14 }}
                                />
                                <Statistic
                                    title="Protein"
                                    value={totals.protein}
                                    suffix="g"
                                    valueStyle={{ fontSize: 14, color: '#1890ff' }}
                                />
                                <Statistic
                                    title="Carbs"
                                    value={totals.carbs}
                                    suffix="g"
                                    valueStyle={{ fontSize: 14, color: '#52c41a' }}
                                />
                                <Statistic
                                    title="Fat"
                                    value={totals.fat}
                                    suffix="g"
                                    valueStyle={{ fontSize: 14, color: '#faad14' }}
                                />
                            </Space>
                        </Col>
                    </Row>
                }
            >
                {day.meals.map(renderMealCard)}
            </Panel>
        );
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                style={{ margin: 20 }}
            />
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Card>
                <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                    <Col>
                        <Title level={3} style={{ margin: 0 }}>
                            <AppleOutlined /> Nutrition Plan
                        </Title>
                        {nutritionPlan?.name && (
                            <Text type="secondary">{nutritionPlan.name}</Text>
                        )}
                    </Col>
                    <Col>
                        <Radio.Group
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            buttonStyle="solid"
                        >
                            <Radio.Button value="today">Today</Radio.Button>
                            <Radio.Button value="week">Current Week</Radio.Button>
                            <Radio.Button value="month">Current Month</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>

                <Divider />

                {filteredDays.length > 0 ? (
                    <Collapse
                        defaultActiveKey={
                            filter === 'today' ? [filteredDays[0]?.day] : []
                        }
                        accordion={filter === 'today'}
                    >
                        {filteredDays.map(renderDayPanel)}
                    </Collapse>
                ) : (
                    <Empty description="No nutrition plan data available" />
                )}
            </Card>
        </div>
    );
};
