import { Card, Typography, Tag } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

interface Props {
    plan: any;
}

export const WorkoutPlanView = ({ plan }: Props) => {
    if (!plan) return <Typography.Text type="secondary">План не назначен</Typography.Text>;

    return (
        <div>
            <Card 
                title={plan.goal} 
                extra={<Tag color="blue">Активный</Tag>}
                style={{ marginBottom: 24 }}
            >
                <Typography.Paragraph>
                    Длительность: {plan.duration} недель
                </Typography.Paragraph>
            </Card>

            {plan.workouts.map((workout, workoutIndex) => (
                <Card 
                    key={workoutIndex} 
                    title={`${workout.name} - ${workout.day}`}
                    style={{ marginBottom: 16 }}
                >
                    {workout.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} style={{ marginBottom: 24 }}>
                            <Typography.Title level={5}>{section.title}</Typography.Title>
                            <div style={{ paddingLeft: 16 }}>
                                {section.exercises.map((exercise, exerciseIndex) => (
                                    <div 
                                        key={exerciseIndex} 
                                        style={{ 
                                            marginBottom: 12, 
                                            padding: 8, 
                                            backgroundColor: '#fafafa',
                                            borderRadius: 4
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography.Text strong>{exercise.name}</Typography.Text>
                                            {exercise.video && (
                                                <a href={exercise.video} target="_blank" rel="noopener noreferrer">
                                                    <PlayCircleOutlined /> Видео
                                                </a>
                                            )}
                                        </div>
                                        <div style={{ marginTop: 4 }}>
                                            <Tag>{exercise.sets} × {exercise.reps}</Tag>
                                            {exercise.weight > 0 && <Tag>Вес: {exercise.weight}кг</Tag>}
                                            <Tag>Отдых: {exercise.rest} сек</Tag>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </Card>
            ))}
        </div>
    );
};