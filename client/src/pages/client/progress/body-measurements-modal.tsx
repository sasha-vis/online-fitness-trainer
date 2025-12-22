import { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Upload, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BodyMeasurement } from '@shared/stores/user/progress/progress-types';
import { MEASUREMENT_FIELDS } from '@shared/stores/user/progress/progress-types';
import { UploadFile } from 'antd';

interface BodyMeasurementModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: Partial<BodyMeasurement>, photos: File[]) => Promise<void>;
    loading?: boolean;
    initialValues?: Partial<BodyMeasurement>;
}

export const BodyMeasurementModal: React.FC<BodyMeasurementModalProps> = ({
    open,
    onClose,
    onSubmit,
    loading,
    initialValues,
}) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (open) form.setFieldsValue(initialValues || {});
    }, [open, initialValues]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const photos: File[] = fileList
                .map((f) => f.originFileObj)
                .filter(Boolean) as File[];
            await onSubmit(values, photos);
            message.success('Отчёт добавлен!');
            handleCancel();
        } catch (e) {
            if (e instanceof Error) {
                message.error(e.message);
            } else {
                message.error('Ошибка');
            }
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        onClose();
    };

    return (
        <Modal
            title="Добавить прогресс"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={loading}
            destroyOnClose
        >
            <Form form={form} layout="vertical" initialValues={initialValues}>
                {MEASUREMENT_FIELDS.map((field) => (
                    <Form.Item
                        key={field.key}
                        name={field.key}
                        label={field.label}
                        rules={[
                            {
                                required: true,
                                message: `Введите значение для "${field.label}"`,
                            },
                        ]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                ))}
            </Form>
        </Modal>
    );
};
