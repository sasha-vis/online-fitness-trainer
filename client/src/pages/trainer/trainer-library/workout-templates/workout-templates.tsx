import { useState } from 'react';
import { WorkoutList } from '@/widgets/workouts/workouts-widget';
import { WorkoutModal } from '@/widgets/workout-modal/workout-modal';
import { workoutTemplates } from '@shared/constants/workout-templates';

import { useTemplatesStore } from '@shared/stores/workout/workout';

import { WorkoutFormData, WorkoutTemplate } from '@shared/stores/workout/workout-types';

import { Button, Modal } from 'antd';

export const WorkoutTemplates = () => {
    const { templates, addTemplate, updateTemplate, deleteTemplate } =
        useTemplatesStore();
    const [modalVisible, setModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState<WorkoutTemplate | null>(null);

    const handleSubmit = (values: WorkoutFormData) => {
        if (currentItem && currentItem.id) {
            updateTemplate(currentItem.id, values);
        } else {
            addTemplate(values);
        }
        setCurrentItem(null);
    };

    const handleEdit = (item: WorkoutTemplate) => {
        setCurrentItem(item);
        setModalVisible(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Удалить шаблон?',
            onOk: () => deleteTemplate(id),
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
                Создать новый шаблон
            </Button>
            <WorkoutList
                list={templates}
                title="Шаблоны планов тренировок"
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <WorkoutModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                initialData={currentItem as WorkoutFormData}
                onSubmit={handleSubmit}
                predefinedOptions={workoutTemplates}
            />
        </>
    );
};
