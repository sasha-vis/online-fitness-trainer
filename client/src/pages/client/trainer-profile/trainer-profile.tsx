import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuthStore } from '@shared/stores/user/user';
import { Typography, Card, Spin, Alert, Divider } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    TrophyOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Trainer {
    id: string;
    fullName: string;
    specialization?: string;
    experience?: string;
    education?: string;
    phone?: string;
    email: string;
    about?: string;
    photoURL?: string;
    certifications?: string[];
}

export const TrainerProfile = () => {
    const [trainer, setTrainer] = useState<Trainer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchTrainer = async () => {
            if (!user?.trainerId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const trainerDoc = await getDoc(doc(db, 'users', user.trainerId));

                if (trainerDoc.exists()) {
                    const trainerData = trainerDoc.data() as Trainer;

                    setTrainer({
                        ...trainerData,
                        id: trainerDoc.id,
                    });
                } else {
                    setError('Тренер не найден в системе');
                }
            } catch (err) {
                console.error('Ошибка загрузки тренера:', err);
                setError('Не удалось загрузить информацию о тренере');
            } finally {
                setLoading(false);
            }
        };

        fetchTrainer();
    }, [user?.trainerId]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
                <Paragraph style={{ marginTop: 16 }}>
                    Загрузка информации о тренере...
                </Paragraph>
            </div>
        );
    }

    if (!user?.trainerId) {
        return (
            <div style={{ width: 600, margin: '0 auto', padding: '24px' }}>
                <Title level={2}>Мой тренер</Title>
                <Card>
                    <div style={{ marginTop: 16 }}>
                        <Paragraph type="secondary">
                            После назначения тренера здесь появится его контактная
                            информация и подробности.
                        </Paragraph>
                    </div>
                </Card>
            </div>
        );
    }

    if (error || !trainer) {
        return (
            <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
                <Title level={2}>Мой тренер</Title>
                <Alert
                    message="Ошибка загрузки"
                    description={error || 'Не удалось загрузить информацию о тренере'}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div style={{ width: 800, margin: '0 auto', padding: '24px' }}>
            <Title level={2}>Мой тренер</Title>

            <Card
                style={{
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    marginBottom: 24,
                }}
            >
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {trainer.photoURL ? (
                        <img
                            src={trainer.photoURL}
                            alt={trainer.fullName}
                            style={{
                                width: 150,
                                height: 150,
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: 150,
                                height: 150,
                                borderRadius: '50%',
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <UserOutlined style={{ fontSize: 60, color: '#999' }} />
                        </div>
                    )}

                    <div style={{ flex: 1 }}>
                        <Title level={3} style={{ marginTop: 0 }}>
                            {trainer.fullName}
                        </Title>

                        {trainer.specialization && (
                            <div style={{ marginBottom: 12 }}>
                                <TrophyOutlined
                                    style={{ marginRight: 8, color: '#1890ff' }}
                                />
                                <Text strong>Специализация: </Text>
                                <Text>{trainer.specialization}</Text>
                            </div>
                        )}

                        {trainer.experience && (
                            <div style={{ marginBottom: 12 }}>
                                <Text strong>Опыт работы: </Text>
                                <Text>{trainer.experience}</Text>
                            </div>
                        )}

                        {trainer.education && (
                            <div style={{ marginBottom: 12 }}>
                                <Text strong>Образование: </Text>
                                <Text>{trainer.education}</Text>
                            </div>
                        )}
                    </div>
                </div>

                <Divider />

                {trainer.about && (
                    <div style={{ marginBottom: 24 }}>
                        <Title level={4}>О тренере</Title>
                        <Paragraph>{trainer.about}</Paragraph>
                    </div>
                )}

                {trainer.certifications && trainer.certifications.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                        <Title level={4}>Сертификации</Title>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {trainer.certifications.map((cert, index) => (
                                <li key={index}>
                                    <Text>{cert}</Text>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 16,
                        marginBottom: 24,
                    }}
                >
                    {trainer.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <PhoneOutlined />
                            <Text strong>Телефон: </Text>
                            <Text>{trainer.phone}</Text>
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MailOutlined />
                        <Text strong>Email: </Text>
                        <Text>{trainer.email}</Text>
                    </div>
                </div>
            </Card>
        </div>
    );
};
