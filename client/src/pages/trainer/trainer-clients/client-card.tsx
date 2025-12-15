import { Card, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

export const ClientCard = ({ client }) => (
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
                {client.trainerId ? (
                    <Typography.Text type="success">Тренер назначен</Typography.Text>
                ) : (
                    <Typography.Text type="danger">Тренер не назначен</Typography.Text>
                )}
            </div>
        </Card>
    </NavLink>
);
