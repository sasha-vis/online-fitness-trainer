import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Upload, Avatar, message, Row, Col } from 'antd';
import type { UploadProps, UploadFile } from 'antd/es/upload/interface';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
interface User {
    id: string;
    firstName: string;
    lastName: string;
    height?: number | null;
    email: string;
    phone?: string;
    avatar?: string | null;
}

interface UpdateUserPayload {
    firstName: string;
    lastName: string;
    height?: number | null;
    email: string;
    phone?: string;
}

interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}

interface UploadAvatarResponse {
    url: string;
}

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

const apiUser = {
    getMe: () => api.get<User>('/user/me'),
    update: (payload: UpdateUserPayload) => api.put<User>('/user/update', payload),
    changePassword: (payload: ChangePasswordPayload) =>
        api.put('/user/change-password', payload),
    uploadAvatar: (formData: FormData) =>
        api.post<UploadAvatarResponse>('/user/upload-avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    logout: () => api.post('/auth/logout'),
};

export const PersonalAccount: React.FC = () => {
    const [form] = Form.useForm<UpdateUserPayload>();
    const [passwordForm] = Form.useForm<ChangePasswordPayload>();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        let mounted = true;
        apiUser
            .getMe()
            .then((res) => {
                if (!mounted) return;
                setUser(res.data);
                setAvatarUrl(res.data.avatar ?? undefined);

                form.setFieldsValue({
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    height: res.data.height ?? undefined,
                    email: res.data.email,
                    phone: res.data.phone ?? undefined,
                } as UpdateUserPayload);
            })
            .catch(() => {
                const fakeUser: User = {
                    id: '1',
                    firstName: 'Иван',
                    lastName: 'Иванов',
                    height: 180,
                    email: 'ivan@mail.ru',
                    phone: '+79998887766',
                    avatar: null,
                };

                if (!mounted) return;
                setUser(fakeUser);
                setAvatarUrl(fakeUser.avatar ?? undefined);

                form.setFieldsValue({
                    firstName: fakeUser.firstName,
                    lastName: fakeUser.lastName,
                    height: fakeUser.height ?? undefined,
                    email: fakeUser.email,
                    phone: fakeUser.phone ?? undefined,
                } as UpdateUserPayload);
            });

        return () => {
            mounted = false;
        };
    }, [form]);

    const onEdit = () => setEditMode(true);
    const onCancel = () => {
        setEditMode(false);
        if (user) {
            form.setFieldsValue({
                firstName: user.firstName,
                lastName: user.lastName,
                height: user.height ?? undefined,
                email: user.email,
                phone: user.phone ?? undefined,
            } as UpdateUserPayload);
            form.resetFields();
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const res = await apiUser.update(values as UpdateUserPayload);
            setUser(res.data);
            setAvatarUrl(res.data.avatar ?? undefined);
            setEditMode(false);
            message.success('Данные сохранены');
        } catch {
            message.error('Ошибка при сохранении');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (values: ChangePasswordPayload) => {
        try {
            await apiUser.changePassword(values);
            passwordForm.resetFields();
            message.success('Пароль изменён');
        } catch {
            message.error('Ошибка при смене пароля');
        }
    };

    const uploadProps: UploadProps = {
        beforeUpload: () => false,
        showUploadList: false,
        onChange: async (info) => {
            const file = info.file as UploadFile;

            if (!file || !file.originFileObj) return;

            const formData = new FormData();
            formData.append('avatar', file.originFileObj);

            try {
                const res = await apiUser.uploadAvatar(formData);
                setAvatarUrl(res.data.url);
                message.success('Аватар загружен');
            } catch {
                message.error('Ошибка при загрузке аватара');
            }
        },
    };

    const logout = async () => {
        try {
            await apiUser.logout();
        } finally {
            navigate('/login');
        }
    };

    if (!user) return null;

    return (
        <Row justify="center" style={{ padding: 16 }}>
            <Col xs={24} sm={20} md={16} lg={12}>
                <Card>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <Avatar size={100} src={avatarUrl} icon={<UserOutlined />} />
                        <div style={{ marginTop: 12 }}>
                            <Upload {...uploadProps} disabled={!editMode}>
                                <Button icon={<UploadOutlined />} disabled={!editMode}>
                                    Загрузить аватар
                                </Button>
                            </Upload>
                        </div>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        disabled={!editMode}
                        initialValues={{
                            firstName: user.firstName,
                            lastName: user.lastName,
                            height: user.height ?? undefined,
                            email: user.email,
                            phone: user.phone ?? undefined,
                        }}
                    >
                        <Form.Item
                            name="firstName"
                            label="Имя"
                            rules={[{ required: true, message: 'Введите имя' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="lastName"
                            label="Фамилия"
                            rules={[{ required: true, message: 'Введите фамилию' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="height"
                            label="Рост"
                            rules={[
                                { required: false },
                                {
                                    type: 'number' as const,
                                    transform: (v) => (v ? Number(v) : undefined),
                                    message: 'Рост должен быть числом',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Почта"
                            rules={[
                                {
                                    required: true,
                                    type: 'email',
                                    message: 'Некорректный email',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Телефон"
                            rules={[{ required: false }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>

                    {!editMode ? (
                        <Button type="primary" onClick={onEdit} block>
                            Редактировать
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="primary"
                                onClick={handleSave}
                                loading={loading}
                                block
                            >
                                Сохранить
                            </Button>
                            <div style={{ height: 12 }} />
                            <Button onClick={onCancel} block>
                                Отмена
                            </Button>
                        </>
                    )}

                    <div style={{ marginTop: 16 }}>
                        <Card title="Изменить пароль">
                            <Form
                                form={passwordForm}
                                onFinish={handlePasswordChange}
                                layout="vertical"
                            >
                                <Form.Item
                                    name="oldPassword"
                                    label="Старый пароль"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Введите старый пароль',
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    name="newPassword"
                                    label="Новый пароль"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Введите новый пароль',
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Button htmlType="submit" type="primary" block>
                                    Изменить пароль
                                </Button>
                            </Form>
                        </Card>
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <Button danger block onClick={logout}>
                            Выйти
                        </Button>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};
