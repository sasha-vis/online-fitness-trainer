import React, { useState } from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    AutoComplete,
    Button,
    Row,
    Col,
    Upload,
    message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';

import { WorkoutFormData } from '@shared/stores/workout/workout-types';

const { TextArea } = Input;

const predefinedExercises = [
    { value: 'Жим штанги' },
    { value: 'Приседания со штангой' },
    { value: 'Вертикальная тяга блока' },
];
interface WorkoutTemplates {
    onSave?: (values: WorkoutFormData) => void;
}

export const ExercisesLibrary: React.FC<WorkoutTemplates> = ({ onSave }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                form.resetFields();
                setIsModalVisible(false);
                if (onSave) {
                    onSave(values);
                }
            })
            .catch((info) => {
                message.error('Validation failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const uploadProps = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', // Замените на реальный эндпоинт, напр. Firebase Storage
        headers: {
            authorization: 'authorization-text',
        },
        // onChange(info) {
        //     if (info.file.status !== 'uploading') {
        //         console.log(info.file, info.fileList);
        //     }
        //     if (info.file.status === 'done') {
        //         // Обработайте успешную загрузку
        //     } else if (info.file.status === 'error') {
        //         // Обработайте ошибку
        //     }
        // },
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Добавить упражнение
            </Button>
            <Modal
                title="Добавление упражнения"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item
                                name="exerciseName"
                                label="Название упражнения"
                                rules={[{ required: true }]}
                            >
                                <AutoComplete
                                    options={predefinedExercises}
                                    placeholder="Выберите или введите название"
                                    filterOption={(inputValue, option) =>
                                        option!.value
                                            .toUpperCase()
                                            .indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                name="sets"
                                label="Подходы"
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={1} placeholder="Количество подходов" />
                            </Form.Item>
                            <Form.Item
                                name="reps"
                                label="Повторы"
                                rules={[{ required: true }]}
                            >
                                <InputNumber
                                    min={1}
                                    placeholder="Количество повторений"
                                />
                            </Form.Item>
                            <Form.Item
                                name="weight"
                                label="Вес"
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={0} placeholder="Вес в кг" />
                            </Form.Item>
                            <Form.Item
                                name="rest"
                                label="Отдых"
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={0} placeholder="Отдых в секундах" />
                            </Form.Item>
                            <Form.Item name="comments" label="Комментарии">
                                <TextArea
                                    rows={4}
                                    placeholder="Дополнительные комментарии"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Upload {...uploadProps} listType="picture-card">
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>
                                        Загрузить инструкцию (изображение/видео)
                                    </div>
                                </div>
                            </Upload>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Outlet />
        </>
    );
};
