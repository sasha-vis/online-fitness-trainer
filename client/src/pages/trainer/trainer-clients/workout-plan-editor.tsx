import { Button, Input, Form, Divider, Card, Space, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useWorkoutStore } from '@shared/stores/workout/workout';

export const WorkoutPlanEditor = () => {
    const editingPlan = useWorkoutStore((s) => s.editingPlan);
    const setEditingPlan = useWorkoutStore((s) => s.setEditingPlan);

    const addExercise = (workoutIndex, sectionIndex) => {
        const newPlan = JSON.parse(JSON.stringify(editingPlan));
        newPlan.workouts[workoutIndex].sections[sectionIndex].exercises.push({
            name: '',
            sets: 3,
            reps: '8-12',
            weight: 0,
            rest: 60,
            video: '',
        });
        setEditingPlan(newPlan);
    };

    const removeExercise = (workoutIndex, sectionIndex, exerciseIndex) => {
        const newPlan = JSON.parse(JSON.stringify(editingPlan));
        newPlan.workouts[workoutIndex].sections[sectionIndex].exercises.splice(
            exerciseIndex,
            1
        );
        setEditingPlan(newPlan);
    };

    const updateExerciseField = (
        workoutIndex,
        sectionIndex,
        exerciseIndex,
        field,
        value
    ) => {
        const newPlan = JSON.parse(JSON.stringify(editingPlan));
        newPlan.workouts[workoutIndex].sections[sectionIndex].exercises[exerciseIndex][
            field
        ] = value;
        setEditingPlan(newPlan);
    };

    if (!editingPlan) return null;

    return (
        <div>
            <Card
                title={`Редактирование плана: ${editingPlan.goal}`}
                style={{ marginBottom: 24 }}
            >
                <Form layout="vertical">
                    <Form.Item label="Название цели">
                        <Input
                            value={editingPlan.goal}
                            onChange={(e) => {
                                const newPlan = { ...editingPlan, goal: e.target.value };
                                setEditingPlan(newPlan);
                            }}
                        />
                    </Form.Item>
                </Form>
            </Card>

            {editingPlan.workouts.map((workout, workoutIndex) => (
                <Card
                    key={workoutIndex}
                    title={workout.name}
                    style={{ marginBottom: 16 }}
                    extra={<small>{workout.day}</small>}
                >
                    {workout.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} style={{ marginBottom: 24 }}>
                            <h4>{section.title}</h4>
                            {section.exercises.map((exercise, exerciseIndex) => (
                                <Card
                                    key={exerciseIndex}
                                    size="small"
                                    style={{ marginBottom: 8 }}
                                    extra={
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() =>
                                                removeExercise(
                                                    workoutIndex,
                                                    sectionIndex,
                                                    exerciseIndex
                                                )
                                            }
                                        />
                                    }
                                >
                                    <Space wrap style={{ width: '100%' }}>
                                        <Input
                                            placeholder="Название упражнения"
                                            value={exercise.name}
                                            onChange={(e) =>
                                                updateExerciseField(
                                                    workoutIndex,
                                                    sectionIndex,
                                                    exerciseIndex,
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: 200 }}
                                        />
                                        <InputNumber
                                            placeholder="Подходы"
                                            value={exercise.sets}
                                            onChange={(value) =>
                                                updateExerciseField(
                                                    workoutIndex,
                                                    sectionIndex,
                                                    exerciseIndex,
                                                    'sets',
                                                    value
                                                )
                                            }
                                            min={1}
                                        />
                                        <Input
                                            placeholder="Повторения"
                                            value={exercise.reps}
                                            onChange={(e) =>
                                                updateExerciseField(
                                                    workoutIndex,
                                                    sectionIndex,
                                                    exerciseIndex,
                                                    'reps',
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: 100 }}
                                        />
                                        <InputNumber
                                            placeholder="Вес (кг)"
                                            value={exercise.weight}
                                            onChange={(value) =>
                                                updateExerciseField(
                                                    workoutIndex,
                                                    sectionIndex,
                                                    exerciseIndex,
                                                    'weight',
                                                    value
                                                )
                                            }
                                            min={0}
                                        />
                                        <InputNumber
                                            placeholder="Отдых (сек)"
                                            value={exercise.rest}
                                            onChange={(value) =>
                                                updateExerciseField(
                                                    workoutIndex,
                                                    sectionIndex,
                                                    exerciseIndex,
                                                    'rest',
                                                    value
                                                )
                                            }
                                            min={0}
                                            addonAfter="сек"
                                        />
                                    </Space>
                                </Card>
                            ))}
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={() => addExercise(workoutIndex, sectionIndex)}
                                block
                            >
                                Добавить упражнение
                            </Button>
                            <Divider />
                        </div>
                    ))}
                </Card>
            ))}
        </div>
    );
};
