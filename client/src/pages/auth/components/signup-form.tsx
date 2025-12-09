import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Typography, Upload, UploadFile } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../index.module.scss';
import { formFields, SignupFieldsNames } from '../scheme';
import { SignupFormValues } from '../types';
import { UploadOutlined } from '@ant-design/icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuthStore } from '@/shared/stores';
import { RcFile } from 'antd/es/upload/interface';

export const SignupForm = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const {
        handleSubmit,
        formState: { errors, isValid },
        control,
    } = useForm<SignupFormValues>({
        mode: 'all',
        defaultValues: {
            [SignupFieldsNames.photos]: [],
        },
    });

    const filesToAntdFileList = (files: File[]): UploadFile[] => {
        return files.map((file, index) => ({
            uid: index.toString(),
            name: file.name,
            status: 'done',
            url: URL.createObjectURL(file),
            originFileObj: file as RcFile,
        }));
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const validatePhotoSize = (files: File[]): boolean => {
        const maxSize = 500 * 1024; // 500 KB
        const oversized = files.find((file) => file.size > maxSize);
        if (oversized) {
            alert(`Фото "${oversized.name}" слишком большое. Максимум 500 КБ.`);
            return false;
        }
        return true;
    };

    const onSubmit = async (data: SignupFormValues) => {
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
            photos,
            weight,
        } = data;

        if (photos && photos.length > 0 && !validatePhotoSize(photos)) {
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            const userId = user.uid;

            const photoBase64: string[] = [];
            if (photos && photos.length > 0) {
                for (const file of photos) {
                    const base64 = await fileToBase64(file);
                    photoBase64.push(base64);
                }
            }

            await setDoc(doc(db, 'users', userId), {
                uid: userId,
                email,
                name,
                surname,
                role: 'client',
                createdAt: new Date(),
            });

            await setDoc(doc(db, 'clientProfiles', userId), {
                currentDiet: diet,
                expectedResult: results,
                userId: userId,
                age: age,
                height: height,
                createdAt: new Date(),
                medicalConditions: medical,
                trainingExperience: experience,
            });

            await setDoc(doc(db, 'bodyMeasurements', userId), {
                arm: arm,
                chest: chest,
                clientId: userId,
                createdAt: new Date(),
                hips: hips,
                leg: leg,
                waist: waist,
                weight: weight,
                photosUrl: photoBase64,
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
                                        <>
                                            {field.name === SignupFieldsNames.password ||
                                            field.name ===
                                                SignupFieldsNames.repeatPassword ? (
                                                <Input.Password
                                                    status={
                                                        errors[field.name] ? 'error' : ''
                                                    }
                                                    value={value as typeof field.name}
                                                    onChange={onChange}
                                                    placeholder={field.placeholder}
                                                />
                                            ) : (
                                                <Input
                                                    status={
                                                        errors[field.name] ? 'error' : ''
                                                    }
                                                    value={value as typeof field.name}
                                                    onChange={onChange}
                                                    placeholder={field.placeholder}
                                                />
                                            )}
                                        </>
                                    )}
                                    {field.type === 'file' && (
                                        <Upload
                                            className={styles.formUpload}
                                            listType="picture"
                                            fileList={filesToAntdFileList(
                                                (value as File[]) || []
                                            )}
                                            beforeUpload={(file) => {
                                                const currentFiles = (value ||
                                                    []) as File[];
                                                onChange([...currentFiles, file]);
                                                return false;
                                            }}
                                            onRemove={(fileToRemove) => {
                                                const currentFiles = (value ||
                                                    []) as File[];
                                                const newFiles = currentFiles.filter(
                                                    (file: File) =>
                                                        file.name !==
                                                        (fileToRemove as UploadFile).name
                                                );
                                                onChange(newFiles);
                                            }}
                                        >
                                            <Button icon={<UploadOutlined />}>
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
