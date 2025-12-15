import { Modal, Button, List } from 'antd';
import { workoutPlan } from '@pages/client/workout-detail/workout-plan-mock';
import { useWorkoutStore } from '@shared/stores/workout/workout';

export const WorkoutPlanModal = ({ visible, onClose, onSelect  }) => {
  const setSelectedPlan = useWorkoutStore((s) => s.setSelectedPlan);
  const handleSelect = (plan) => {
        setSelectedPlan(plan);
        onSelect(plan);
  };
  return (
        <Modal 
            title="Выберите шаблон тренировок" 
            open={visible} 
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <List
                dataSource={workoutPlan}
                renderItem={item => (
                    <List.Item
                        actions={[
                            <Button type="link" onClick={() => handleSelect(item)}>
                                Выбрать
                            </Button>
                        ]}
                    >
                        <List.Item.Meta 
                            title={item.goal}
                            // description={`${item.duration} недель, ${item.workouts.length} тренировок в неделю`}
                        />
                    </List.Item>
                )}
            />
            <Button type="dashed" block style={{ marginTop: 16 }}>
                Создать свой план с нуля
            </Button>
        </Modal>
    );
};