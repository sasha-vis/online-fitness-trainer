import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../index.module.scss';
import { LoginFieldsNames } from '../scheme';
import { LoginFormValues } from '../types';
import { useAuthStore } from '@/shared/stores/user/user';
import { findUser, TEST_USERS } from '@/shared/data/test-users';

export const LoginForm = () => {
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const {
        handleSubmit,
        formState: { errors, isValid },
        control,
    } = useForm<LoginFormValues>();

    const onSubmit = (data: LoginFormValues) => {
        const user = findUser(data.email, data.password);

        if (user) {
            login(user, 'mock-token');
            navigate(user.role === 'trainer' ? '/trainer' : '/client');
        } else {
            const availableUsers = TEST_USERS.map(
                (u) => `${u.email} / ${u.password}`
            ).join('\n');
            alert(
                `Неверный email или пароль\n\nДоступные тестовые пользователи:\n${availableUsers}`
            );
        }
    };

    return (
        <div className={styles.formWrapper}>
            <Typography.Title level={2}>Вход</Typography.Title>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formItem}>
                    <Typography.Text strong>Email</Typography.Text>
                    {errors[LoginFieldsNames.email] && (
                        <Typography.Text type="danger">
                            {errors[LoginFieldsNames.email]?.message}
                        </Typography.Text>
                    )}
                    <Controller
                        name={LoginFieldsNames.email}
                        control={control}
                        rules={{
                            required: true,
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Некорректный формат email',
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                status={errors[LoginFieldsNames.email] ? 'error' : ''}
                                value={value}
                                onChange={onChange}
                                placeholder="example@mail.com"
                            />
                        )}
                    />
                </div>
                <div className={styles.formItem}>
                    <Typography.Text strong>Пароль</Typography.Text>
                    {errors[LoginFieldsNames.password] && (
                        <Typography.Text type="danger">
                            {errors[LoginFieldsNames.password]?.message}
                        </Typography.Text>
                    )}
                    <Controller
                        name={LoginFieldsNames.password}
                        control={control}
                        rules={{
                            required: 'Пароль обязателен',
                            minLength: {
                                value: 6,
                                message: 'Минимум 6 символов',
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                status={errors[LoginFieldsNames.password] ? 'error' : ''}
                                value={value}
                                onChange={onChange}
                                placeholder="Введите пароль"
                            />
                        )}
                    />
                </div>
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!isValid}
                    className={styles.formItem}
                >
                    Войти
                </Button>
                <Typography.Text className={styles.formLink}>
                    Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
                </Typography.Text>
                <Typography.Text className={styles.formLink}>
                    <Link to="">Восстановить пароль</Link>
                </Typography.Text>
            </form>
        </div>
    );
};
