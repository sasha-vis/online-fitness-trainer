import { useEffect } from 'react';
import { Row, Col, Spin, Alert } from 'antd';
import { useTrainerStore } from '@shared/stores/trainer/trainer';
import { ClientCard } from './client-card';

export const ClientList = () => {
    const { clients, fetchClients, loading, error } = useTrainerStore();

    useEffect(() => {
        fetchClients();
    }, []);

    if (loading) return <Spin />;
    if (error) return <Alert type="error" message={error} />;

    return (
        <>
            <Row gutter={[16, 16]}>
                {clients.map((client: unknown) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={client.id}>
                        <ClientCard client={client} />
                    </Col>
                ))}
            </Row>
        </>
    );
};
