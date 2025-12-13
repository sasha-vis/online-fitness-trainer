import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Upload, Avatar, message, Row, Col } from 'antd';
import type { UploadProps, UploadFile } from 'antd/es/upload/interface';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores';
import { signOut as firebaseSignOut } from 'firebase/auth';
import {getUserByUid, getUserInfo, updateUserByUid} from './api-user-firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';
import {IUser, IUserInfo} from "@pages/personal-account/types.ts";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from 'firebase/auth';
import { auth } from '@/firebase';

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
    update: (payload: UpdateUserPayload) => api.put<IUser>('/user/update', payload),
    uploadAvatar: (formData: FormData) =>
        api.post<UploadAvatarResponse>('/user/upload-avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};

export const PersonalAccount: React.FC = () => {
    const [form] = Form.useForm<UpdateUserPayload>();
    const [passwordForm] = Form.useForm<ChangePasswordPayload>();
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const [user, setUser] = useState<IUser | null>(null);
    const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
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
                const userInfoData = await getUserInfo(firebaseUser.uid);

                if (!mounted || !userData) return;

                setUser(userData);
                setUserInfo(userInfoData);
                setAvatarUrl(userInfoData?.profile_photo_url ?? undefined);

                form.setFieldsValue({
                    name: userData.name,
                    surname: userData.surname,
                    height: userInfoData?.height ?? undefined,
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
                height: userInfo?.height ?? undefined,
                email: user.email,
                phone: user.phone ?? undefined,
            } as UpdateUserPayload);
            form.resetFields();
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const user = auth.currentUser;
            if (!user) {
                message.error('Пользователь не авторизован');
                return;
            }

            const values = await form.validateFields();

            const updatedUser = await updateUserByUid(
                user.uid,
                values as IUser
            );

            setUser(updatedUser);
            setAvatarUrl(updatedUser.avatar ?? undefined);
            setEditMode(false);

            message.success('Данные сохранены');
        } catch (error) {
            console.error(error);
            message.error('Ошибка при сохранении');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (values: ChangePasswordPayload) => {
        try {
            const user = auth.currentUser;

            if (!user || !user.email) {
                message.error('Пользователь не авторизован');
                return;
            }

            const credential = EmailAuthProvider.credential(
                user.email,
                values.oldPassword
            );

            await reauthenticateWithCredential(user, credential);

            await updatePassword(user, values.newPassword);

            passwordForm.resetFields();
            message.success('Пароль успешно изменён');
        } catch (error: any) {
            switch (error.code) {
                case 'auth/wrong-password':
                    passwordForm.setFields([
                        {
                            name: 'oldPassword',
                            errors: ['Неверный текущий пароль'],
                        },
                    ]);
                    break;

                case 'auth/weak-password':
                    passwordForm.setFields([
                        {
                            name: 'newPassword',
                            errors: ['Пароль слишком простой'],
                        },
                    ]);
                    break;

                case 'auth/requires-recent-login':
                    message.error('Пожалуйста, войдите заново и повторите попытку');
                    break;

                default:
                    console.error(error);
                    message.error('Ошибка при смене пароля');
            }
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
                            height: userInfo?.height ?? undefined,
                            email: user.email,
                            phone: user.phone ?? undefined,
                        }}
                    >
                        <Form.Item
                            name="name"
                            label="Имя"
                            rules={[
                                { required: true, message: 'Введите имя' },
                                { min: 2, message: 'Минимум 2 символа' },
                                {
                                    pattern: /^[a-zA-Zа-яА-ЯёЁ]+$/,
                                    message: 'Допустимы только буквы',
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="surname"
                            label="Фамилия"
                            rules={[
                                { required: true, message: 'Введите имя' },
                                { min: 2, message: 'Минимум 2 символа' },
                                {
                                    pattern: /^[a-zA-Zа-яА-ЯёЁ]+$/,
                                    message: 'Допустимы только буквы',
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="height"
                            label="Рост (см)"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (value === undefined || value === null || value === '') {
                                            return Promise.resolve();
                                        }

                                        const num = Number(value);

                                        if (Number.isNaN(num)) {
                                            return Promise.reject('Рост должен быть числом');
                                        }

                                        if (num < 50 || num > 250) {
                                            return Promise.reject('Рост должен быть от 50 до 250 см');
                                        }

                                        return Promise.resolve();
                                    },
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
                            rules={[
                                {
                                    pattern: /^\+7\d{10}$/,
                                    message: 'Формат: +7XXXXXXXXXX',
                                },
                            ]}

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
