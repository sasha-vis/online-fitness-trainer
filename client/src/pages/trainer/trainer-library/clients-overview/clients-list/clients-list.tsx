import { useState, useEffect } from 'react';
import { Row, Col, Spin, Alert } from 'antd';
import { useTrainerStore } from '@shared/stores/trainer/trainer';
import { useAuthStore } from '@/shared/stores/user/user';
import { ClientCard } from '../client-card/client-card'

export const ClientList = () => {
    const { clients, fetchClients, loading, error, assignTrainer, assignPlan } = useTrainerStore();
    const { user } = useAuthStore();
    const [modalClientId, setModalClientId] = useState(null);

    useEffect(() => {
      fetchClients();
    }, []);

    if (loading) return <Spin />;
    if (error) return <Alert type="error" message={error} />;
    console.log(clients)

    return (
        <>
            <Row gutter={[16, 16]}>
            {clients.map((client: unknown) => (
          <Col xs={24} sm={12} md={8} lg={6} key={client.id}>
            <ClientCard
              client={client}
              trainer={user}
              onAssignTrainer={() => assignTrainer(client.id, user)}
              onAssignPlan={() => setModalClientId(client.id)}
            />
          </Col>
        ))}
            </Row>
        </>
    );
};
