import { useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { WorkoutModalProps, WorkoutFormData } from '@shared/stores/workout/workout-types';

// const { Title, Text } = Typography;
// const { Panel } = Collapse;
const { Option } = Select;

export const WorkoutModal: React.FC<WorkoutModalProps> = ({
    visible,
    onClose,
    initialData,
    onSubmit,
    predefinedOptions,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue(initialData);
        }
    }, [initialData, form]);

    const handleSubmit = (values: WorkoutFormData) => {
        onSubmit(values);
        form.resetFields();
        onClose();
    };

    const handleBaseSelect = (value: string) => {
        const selected = predefinedOptions.find((opt) => opt.name === value);
        if (selected) {
            form.setFieldsValue(selected);
        }
    };

    return (
        <Modal
            visible={visible}
            title={initialData ? 'Редактировать' : 'Создать новый'}
            okText={initialData ? 'Обновить' : 'Создать'}
            cancelText="Отмена"
            onCancel={onClose}
            onOk={() => form.submit()}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelWrap
            >
                <Form.Item label="Базовый шаблон">
                    <Select
                        placeholder="Опишите шаблон"
                        onChange={handleBaseSelect}
                        allowClear
                    >
                        {predefinedOptions.map((opt) => (
                            <Option key={opt.name} value={opt.name}>
                                {opt.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Название"
                    rules={[{ required: true, message: 'Введите название' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Описание">
                    <Input.TextArea rows={2} />
                </Form.Item>
                <Form.List name="exercises">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                    key={key}
                                    align="baseline"
                                    style={{ display: 'flex', marginBottom: 8 }}
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'name']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Название упражнения',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Упражнение" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'reps']}
                                        rules={[{ required: true, message: 'Подходы' }]}
                                    >
                                        <InputNumber
                                            placeholder="Подходы (e.g. 3x10)"
                                            min={1}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'rest']}
                                        rules={[{ required: true, message: 'Отдых' }]}
                                    >
                                        <InputNumber placeholder="Отдых (сек)" min={0} />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'повторения']}>
                                        <InputNumber placeholder="Количество" min={1} />
                                    </Form.Item>
                                    <Button danger onClick={() => remove(name)}>
                                        Удалить
                                    </Button>
                                </Space>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Добавить упражнение
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};
