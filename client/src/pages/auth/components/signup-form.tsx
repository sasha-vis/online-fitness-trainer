import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Typography, Upload } from 'antd';
import { Link } from 'react-router-dom';
import styles from '../index.module.scss';
import { formFields } from '../scheme';
import { SignupFormValues } from '../types';
import { UploadOutlined } from '@ant-design/icons';

export const SignupForm = () => {
    const {
        handleSubmit,
        formState: { errors, isValid },
        control,
    } = useForm<SignupFormValues>({ mode: 'all' });

    const onSubmit = () => {
        /* empty */
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
