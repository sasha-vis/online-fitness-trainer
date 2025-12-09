import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Typography, Upload } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../index.module.scss';
import { formFields, SignupFieldsNames } from '../scheme';
import { SignupFormValues } from '../types';
import { UploadOutlined } from '@ant-design/icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuthStore } from '@/shared/stores';

export const SignupForm = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const {
        handleSubmit,
        formState: { errors, isValid },
        control,
        getValues,
        setError,
        clearErrors,
    } = useForm<SignupFormValues>({
        mode: 'all',
        defaultValues: {
            [SignupFieldsNames.photos]: [],
        },
    });

    const validatePasswords = () => {
        const { password, repeatPassword } = getValues();
        if (password !== repeatPassword) {
            setError(SignupFieldsNames.repeatPassword, {
                type: 'manual',
                message: 'Пароли не совпадают',
            });
            return false;
        } else {
            clearErrors(SignupFieldsNames.repeatPassword);
            return true;
        }
    };

    const onSubmit = async (data: SignupFormValues) => {
        if (!validatePasswords()) return;

        const {
            email,
            password,
            name,
            surname,
            age,
            height,
            chest,
            waist,
            hips,
            arm,
            leg,
            results,
            medical,
            experience,
            diet,
        } = data;

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            const userId = user.uid;

            await setDoc(doc(db, 'users', userId), {
                uid: userId,
                email,
                name,
                surname,
                role: 'client',
                createdAt: new Date(),
            });

            await setDoc(doc(db, 'anthropometry', userId), {
                userId,
                age: Number(age),
                height: Number(height),
                chest: Number(chest),
                waist: Number(waist),
                hips: Number(hips),
                arm: Number(arm),
                leg: Number(leg),
                results,
                medical,
                experience,
                diet,
                createdAt: new Date(),
            });

            login(
                {
                    id: userId,
                    email: user.email!,
                    name: name || '',
                    surname: surname || '',
                    role: 'client',
                },
                user.refreshToken
            );

            navigate('/client');
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className={`${styles.formWrapper} ${styles.formWrapperSignup}`}>
            <Typography.Title level={2}>Регистрация</Typography.Title>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                {formFields.map((field, index) => (
                    <div className={styles.formItem} key={index}>
                        <Typography.Text strong>{field.label}</Typography.Text>
                        {errors[field.name] && (
                            <Typography.Text type="danger">
                                {errors[field.name]?.message}
                            </Typography.Text>
                        )}
                        <Controller
                            name={field.name}
                            control={control}
                            rules={field.rules}
                            render={({ field: { onChange, value } }) => (
                                <>
                                    {field.type === 'textarea' && (
                                        <Input.TextArea
                                            status={errors[field.name] ? 'error' : ''}
                                            value={value as typeof field.name}
                                            onChange={onChange}
                                            placeholder={field.placeholder}
                                            rows={4}
                                        />
                                    )}
                                    {field.type === 'input' && (
                                        <Input
                                            status={errors[field.name] ? 'error' : ''}
                                            value={value as typeof field.name}
                                            onChange={onChange}
                                            placeholder={field.placeholder}
                                        />
                                    )}
                                    {field.type === 'file' && (
                                        <Upload
                                            className={styles.formUpload}
                                            listType="picture"
                                        >
                                            <Button
                                                type="primary"
                                                icon={<UploadOutlined />}
                                            >
                                                Загрузить фото
                                            </Button>
                                        </Upload>
                                    )}
                                </>
                            )}
                        />
                    </div>
                ))}
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!isValid}
                    className={styles.formItem}
                >
                    Зарегистрироваться
                </Button>
                <Typography.Text className={styles.formLink}>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </Typography.Text>
            </form>
        </div>
    );
};
