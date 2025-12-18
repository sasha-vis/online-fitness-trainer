import { useState, useEffect } from 'react';
import { useProgressStore } from '@shared/stores/user/progress/progress';
import { useAuthStore } from '@shared/stores/user/user';
import { ReportsList } from './reports-list';
import { BodyMeasurementModal } from './body-measurements-modal';
import { Typography } from 'antd';

import { BodyMeasurement } from '@shared/stores/user/progress/progress-types';

const { Title } = Typography;

export const ReportsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<BodyMeasurement | null>(null);
  const { user } = useAuthStore();
  const { measurements, add, update, remove, subscribe } = useProgressStore();

  useEffect(() => {
    // if (user?.uid) subscribe(user.uid);
    if (user?.id) subscribe(user.id);
  }, [user, subscribe]);

  const handleEdit = (record: BodyMeasurement) => {
    setEditRecord(record);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    remove(id);
  };

  const handleSubmit = async (values: Omit<BodyMeasurement, 'id' | 'clientId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
        return;
    }
    if (editRecord && editRecord.id) {
        await update(editRecord.id, values);
    } else {
        await add({ ...values, clientId: user.id });
    }
  }


  return (
    <section style={{ padding: 24 }}>
      <Title level={3}>Все отчёты</Title>
      <ReportsList 
        data={measurements} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
      <BodyMeasurementModal 
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditRecord(null); }}
        onSubmit={handleSubmit}
        initialValues={editRecord || undefined}
      />
    </section>
  );
};