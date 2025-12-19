import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../index.module.scss';
import { LoginFieldsNames } from '../scheme';
import { LoginFormValues } from '../types';
import { useAuthStore } from '@/shared/stores/user/user';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const LoginForm = () => {
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const {
        handleSubmit,
        formState: { errors, isValid },
        control,
    } = useForm<LoginFormValues>();

    const onSubmit = async (data: LoginFormValues) => {
        const { email, password } = data;

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const firebaseUser = userCredential.user;

            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (!userDoc.exists()) {
                throw new Error('Пользователь не найден в базе данных');
            }

            const userData = userDoc.data();
            const role = userData.role || 'client';

            login(
                {
                    id: firebaseUser.uid,
                    email: firebaseUser.email!,
                    name: userData.name || '',
                    surname: userData.surname || '',
                    role: role,
                    trainerId: userData.trainerId,
                },
                firebaseUser.refreshToken
            );

            navigate(role === 'trainer' ? '/trainer' : '/client');
        } catch (error) {
            alert(error);
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
                            <Input.Password
                                type="password"
                                visibilityToggle={true}
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
