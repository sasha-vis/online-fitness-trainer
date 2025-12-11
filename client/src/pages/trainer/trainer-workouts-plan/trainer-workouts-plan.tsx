import { useState } from 'react';
import { WorkoutList } from '@/widgets/workouts/workouts-widget';
import { workoutPlans } from '@shared/constants/workout-plans';
import { WorkoutModal } from '@/widgets/workout-modal/workout-modal';

import { usePlansStore } from '@shared/stores/workout/workout';

import {
    WorkoutPlan,
    WorkoutFormData,
    WorkoutListItem,
} from '@shared/stores/workout/workout-types';

import { Button, Modal } from 'antd';

export const TrainerWorkoutsPlan = () => {
    const { plans, addPlan, updatePlan, deletePlan } = usePlansStore();
    const [modalVisible, setModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState<WorkoutPlan | null>(null);

    const handleSubmit = (values: WorkoutFormData) => {
        if (currentItem && currentItem.id) {
            updatePlan(currentItem.id, values);
        } else {
            addPlan(values);
        }
        setCurrentItem(null);
    };

    const handleEdit = (item: WorkoutListItem) => {
        setCurrentItem(item);
        setModalVisible(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Удалить план?',
            onOk: () => deletePlan(id),
        });
    };

    return (
        <>
            <Button
                type="primary"
                onClick={() => {
                    setCurrentItem(null);
                    setModalVisible(true);
                }}
                style={{ margin: '20px' }}
            >
                Создать новый план
            </Button>
            <WorkoutList
                list={plans}
                title="Планы тренировок"
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <WorkoutModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                initialData={currentItem as WorkoutFormData}
                onSubmit={handleSubmit}
                predefinedOptions={workoutPlans}
            />
        </>
    );
};
