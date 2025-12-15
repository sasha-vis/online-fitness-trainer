import { Button, message } from 'antd';
import { useTrainerStore } from '@shared/stores/trainer/trainer';
import { useWorkoutStore } from '@shared/stores/workout/workout';

interface Props {
    clientId: string;
    onSuccess?: () => void;
}

export const AssignPlanButton = ({ clientId, onSuccess }: Props) => {
    const { assignPlan } = useTrainerStore();
    const editingPlan = useWorkoutStore((s) => s.editingPlan);

    const handleAssign = async () => {
        if (!editingPlan) {
            message.warning('Сначала создайте или выберите план');
            return;
        }

        try {
            await assignPlan(clientId, 'workoutPlan', editingPlan);
            message.success('План тренировок успешно назначен');
            onSuccess?.();
        } catch (error) {
            message.error('Ошибка при назначении плана');
        }
    };

    return (
        <Button 
            type="primary" 
            onClick={handleAssign}
            disabled={!editingPlan}
        >
            Назначить план
        </Button>
    );
};