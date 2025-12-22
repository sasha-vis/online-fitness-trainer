import { Card, Typography, Tag, Collapse, Space, List } from 'antd';
import { AppleOutlined, FireOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Title, Text } = Typography;

interface Props {
    plan: any;
}

export const NutritionPlanView = ({ plan }: Props) => {
    if (!plan)
        return (
            <Typography.Text type="secondary">План питания не назначен</Typography.Text>
        );

    const days = Array.isArray(plan.days) ? plan.days : [];

    return (
        <Card>
            <Title level={4}>{plan.name || 'План питания'}</Title>
            {plan.description && <Text type="secondary">{plan.description}</Text>}

            <div style={{ marginTop: 16, marginBottom: 24 }}>
                <Space size="middle">
                    {plan.goal && <Tag color="green">Цель: {plan.goal}</Tag>}
                    {plan.difficulty && (
                        <Tag
                            color={
                                plan.difficulty === 'Начинающий'
                                    ? 'green'
                                    : plan.difficulty === 'Средний'
                                      ? 'orange'
                                      : 'red'
                            }
                        >
                            Уровень: {plan.difficulty}
                        </Tag>
                    )}
                    {plan.durationDays && (
                        <Tag color="blue">{plan.durationDays} дней</Tag>
                    )}
                </Space>
            </div>

            {days.length > 0 ? (
                <Collapse defaultActiveKey={[0]}>
                    {days.map((day, dayIndex) => (
                        <Panel header={day.name || ''} key={dayIndex}>
                            {Array.isArray(day.meals) && day.meals.length > 0 ? (
                                day.meals.map((meal, mealIndex) => {
                                    const mealCalories = Array.isArray(meal.dishes)
                                        ? meal.dishes.reduce(
                                              (total, dish) =>
                                                  total + (dish.calories || 0),
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
                                                        {meal.name ||
                                                            `Прием пищи ${mealIndex + 1}`}
                                                    </Text>
                                                    <Tag>{meal.timeOfDay || ''}</Tag>
                                                    {mealCalories > 0 && (
                                                        <Tag
                                                            color="orange"
                                                            icon={<FireOutlined />}
                                                        >
                                                            {mealCalories} ккал
                                                        </Tag>
                                                    )}
                                                </Space>
                                            }
                                        >
                                            {meal.description && (
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        display: 'block',
                                                        marginBottom: 12,
                                                    }}
                                                >
                                                    {meal.description}
                                                </Text>
                                            )}

                                            {Array.isArray(meal.dishes) &&
                                            meal.dishes.length > 0 ? (
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
                                                                            <Tag>
                                                                                {
                                                                                    dish.portion
                                                                                }
                                                                            </Tag>
                                                                        )}
                                                                    </Space>
                                                                }
                                                                description={
                                                                    <Space size="middle">
                                                                        {dish.calories >
                                                                            0 && (
                                                                            <Text type="secondary">
                                                                                <FireOutlined />{' '}
                                                                                {
                                                                                    dish.calories
                                                                                }{' '}
                                                                                ккал
                                                                            </Text>
                                                                        )}
                                                                        {dish.protein >
                                                                            0 && (
                                                                            <Text type="secondary">
                                                                                Б:{' '}
                                                                                {
                                                                                    dish.protein
                                                                                }
                                                                                г
                                                                            </Text>
                                                                        )}
                                                                        {dish.carbs >
                                                                            0 && (
                                                                            <Text type="secondary">
                                                                                У:{' '}
                                                                                {
                                                                                    dish.carbs
                                                                                }
                                                                                г
                                                                            </Text>
                                                                        )}
                                                                        {dish.fat > 0 && (
                                                                            <Text type="secondary">
                                                                                Ж:{' '}
                                                                                {dish.fat}
                                                                                г
                                                                            </Text>
                                                                        )}
                                                                    </Space>
                                                                }
                                                            />
                                                        </List.Item>
                                                    )}
                                                />
                                            ) : (
                                                <Text type="secondary">
                                                    Блюда не добавлены
                                                </Text>
                                            )}
                                        </Card>
                                    );
                                })
                            ) : (
                                <Text type="secondary">Приемы пищи не добавлены</Text>
                            )}
                        </Panel>
                    ))}
                </Collapse>
            ) : (
                <Text type="secondary">Дни питания не добавлены</Text>
            )}
        </Card>
    );
};
