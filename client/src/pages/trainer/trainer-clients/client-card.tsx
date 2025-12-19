import { Card, Avatar, Typography, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

export const ClientCard = ({ user, client }) => (
    <NavLink to={client.id}>
        <Card style={{ width: 300, margin: 16 }} hoverable>
            <Card.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={<Typography.Text strong>{client.name}</Typography.Text>}
                description={
                    <Typography.Text type="secondary">{client.email}</Typography.Text>
                }
            />
            <div style={{ marginTop: 12 }}>
                {!client.trainerId ? (
                    <Tag color="red" style={{ margin: 0 }}>
                        <strong>Без тренера</strong>
                    </Tag>
                ) : client.trainerId === user.id ? (
                    <Tag color="green" style={{ margin: 0 }}>
                        <strong>Ваш клиент</strong>
                    </Tag>
                ) : (
                    <Tag color="orange" style={{ margin: 0 }}>
                        <strong>Занят другим</strong>
                    </Tag>
                )}
            </div>
        </Card>
    </NavLink>
);
