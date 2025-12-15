import { Card, Typography, Tag, Collapse, Space, Row, Col, Statistic } from 'antd';
import { PlayCircleOutlined, CalendarOutlined, FireOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Title, Text } = Typography;

interface Props {
    plan: any;
}

export const WorkoutPlanView = ({ plan }: Props) => {
    if (!plan)
        return <Typography.Text type="secondary">План не назначен</Typography.Text>;

    // Безопасный доступ к массивам
    const weeks = Array.isArray(plan.weeks) ? plan.weeks : [];
    const workouts = Array.isArray(plan.workouts) ? plan.workouts : [];

    // Если план в формате weeks (как из trainingPlanTemplates)
    if (weeks.length > 0) {
        return (
            <Card>
                <Title level={4}>{plan.name || 'План тренировок'}</Title>
                {plan.description && <Text type="secondary">{plan.description}</Text>}

                <div style={{ marginTop: 16, marginBottom: 24 }}>
                    <Space size="middle">
                        {plan.goal && <Tag color="blue">Цель: {plan.goal}</Tag>}
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
                        {plan.durationWeeks && (
                            <Tag color="purple">{plan.durationWeeks} недель</Tag>
                        )}
                    </Space>
                </div>

                <Collapse defaultActiveKey={[0]}>
                    {weeks.map((week, weekIndex) => (
                        <Panel header={week.name || ''} key={weekIndex}>
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
                                                style={{
                                                    display: 'block',
                                                    marginBottom: 12,
                                                }}
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
                                                            justifyContent:
                                                                'space-between',
                                                        }}
                                                    >
                                                        <Text strong>
                                                            {exercise.exerciseTitle ||
                                                                exercise.name}
                                                        </Text>
                                                        {exercise.videoUrl && (
                                                            <a
                                                                href={exercise.videoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <PlayCircleOutlined />{' '}
                                                                Видео
                                                            </a>
                                                        )}
                                                    </div>
                                                    <div style={{ marginTop: 4 }}>
                                                        <Tag>{exercise.muscleGroup}</Tag>
                                                        <Tag>
                                                            {exercise.sets} ×{' '}
                                                            {exercise.reps}
                                                        </Tag>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <Text type="secondary">
                                                Упражнения не добавлены
                                            </Text>
                                        )}
                                    </Card>
                                ))
                            ) : (
                                <Text type="secondary">Тренировки не добавлены</Text>
                            )}
                        </Panel>
                    ))}
                </Collapse>
            </Card>
        );
    }

    // Если план в старом формате (workouts)
    if (workouts.length > 0) {
        return (
            <Card>
                <Card
                    title={plan.goal || plan.name}
                    extra={<Tag color="blue">Активный</Tag>}
                    style={{ marginBottom: 24 }}
                >
                    {plan.duration && (
                        <Typography.Paragraph>
                            Длительность: {plan.duration} недель
                        </Typography.Paragraph>
                    )}
                </Card>

                {workouts.map((workout, workoutIndex) => (
                    <Card
                        key={workoutIndex}
                        title={`${workout.name} - ${workout.day}`}
                        style={{ marginBottom: 16 }}
                    >
                        {Array.isArray(workout.sections) &&
                        workout.sections.length > 0 ? (
                            workout.sections.map((section, sectionIndex) => (
                                <div key={sectionIndex} style={{ marginBottom: 24 }}>
                                    <Typography.Title level={5}>
                                        {section.title}
                                    </Typography.Title>
                                    <div style={{ paddingLeft: 16 }}>
                                        {Array.isArray(section.exercises) &&
                                            section.exercises.map(
                                                (exercise, exerciseIndex) => (
                                                    <div
                                                        key={exerciseIndex}
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
                                                                justifyContent:
                                                                    'space-between',
                                                            }}
                                                        >
                                                            <Typography.Text strong>
                                                                {exercise.name}
                                                            </Typography.Text>
                                                            {exercise.video && (
                                                                <a
                                                                    href={exercise.video}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <PlayCircleOutlined />{' '}
                                                                    Видео
                                                                </a>
                                                            )}
                                                        </div>
                                                        <div style={{ marginTop: 4 }}>
                                                            <Tag>
                                                                {exercise.sets} ×{' '}
                                                                {exercise.reps}
                                                            </Tag>
                                                            {exercise.weight > 0 && (
                                                                <Tag>
                                                                    Вес: {exercise.weight}
                                                                    кг
                                                                </Tag>
                                                            )}
                                                            <Tag>
                                                                Отдых: {exercise.rest} сек
                                                            </Tag>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Text type="secondary">Секции не добавлены</Text>
                        )}
                    </Card>
                ))}
            </Card>
        );
    }

    return <Typography.Text type="secondary">План тренировок пуст</Typography.Text>;
};
