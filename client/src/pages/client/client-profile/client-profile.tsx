import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Upload, Avatar, message, Row, Col } from 'antd';
import type { UploadProps, UploadFile } from 'antd/es/upload/interface';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { getUserByUid } from '@pages/client-profile-page/api-user-firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';

interface User {
    id: string;
    name: string;
    surname: string;
    height?: number | null;
    email: string;
    phone?: string;
    avatar?: string | null;
}

interface UpdateUserPayload {
    name: string;
    surname: string;
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

export const ClientProfile: React.FC = () => {
    const [form] = Form.useForm<UpdateUserPayload>();
    const [passwordForm] = Form.useForm<ChangePasswordPayload>();
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        let mounted = true;

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                message.error('Пользователь не авторизован');
                navigate('/login');
                return;
            }

            try {
                const userData = await getUserByUid(firebaseUser.uid);

                if (!mounted || !userData) return;

                setUser(userData);
                setAvatarUrl(userData.avatar ?? undefined);

                form.setFieldsValue({
                    name: userData.name,
                    surname: userData.surname,
                    height: userData.height ?? undefined,
                    email: userData.email,
                    phone: userData.phone ?? undefined,
                });
            } catch {
                message.error('Ошибка загрузки профиля');
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, [form, navigate]);

    const onEdit = () => setEditMode(true);
    const onCancel = () => {
        setEditMode(false);
        if (user) {
            form.setFieldsValue({
                name: user.name,
                surname: user.surname,
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

    const handleLogout = async () => {
        try {
            await firebaseSignOut(auth);
            logout();
            navigate('/login');
        } catch (error) {
            alert(error);
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
                            name: user.name,
                            surname: user.surname,
                            height: user.height ?? undefined,
                            email: user.email,
                            phone: user.phone ?? undefined,
                        }}
                    >
                        <Form.Item
                            name="name"
                            label="Имя"
                            rules={[{ required: true, message: 'Введите имя' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="surname"
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
                        <Button danger block onClick={handleLogout}>
                            Выйти
                        </Button>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};
