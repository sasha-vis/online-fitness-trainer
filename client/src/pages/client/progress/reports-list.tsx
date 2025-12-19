import { List, Card, Flex, Typography, Spin, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React from 'react';
import { BodyMeasurement } from '@shared/stores/user/progress/progress-types';

const { Text } = Typography;

export interface ReportsListProps {
    data: BodyMeasurement[];
    subscribeLoading: boolean | undefined;
    onEdit: (item: BodyMeasurement) => void;
    onDelete: (id: string) => void;
}

export const ReportsList: React.FC<ReportsListProps> = ({
    data,
    subscribeLoading,
    onEdit,
    onDelete,
}) => {
    if (subscribeLoading && data.length === 0) {
        return <Spin size="large" style={{ display: 'block', marginTop: 20 }} />;
    }

    return (
        <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={data}
            renderItem={(item) => (
                <List.Item>
                    <Card
                        hoverable
                        onClick={() => onEdit(item)}
                        style={{ marginBottom: 16 }}
                    >
                        <Flex justify="space-between" align="center">
                            <Flex vertical style={{ width: '20%' }}>
                                <Text strong>
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleDateString()
                                        : 'Дата не указана'}
                                </Text>
                            </Flex>

                            <Flex justify="space-around" style={{ width: '60%' }}>
                                <Flex vertical>
                                    <Text>Обхват руки: {item.arm || '-'} см</Text>
                                    <Text>Обхват груди: {item.chest || '-'} см</Text>
                                    <Text>Обхват бёдер: {item.hips || '-'} см</Text>
                                </Flex>
                                <Flex vertical>
                                    <Text>Обхват ног: {item.leg || '-'} см</Text>
                                    <Text>Обхват талии: {item.waist || '-'} см</Text>
                                    <Text>Вес: {item.weight || '-'} кг</Text>
                                </Flex>
                            </Flex>
                            <Flex vertical justify="space-between" gap={5}>
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => onEdit(item)}
                                    type="primary"
                                    shape="circle"
                                />
                                <Popconfirm
                                    title="Удалить отчёт?"
                                    onConfirm={(e) => {
                                        e?.stopPropagation();
                                        onDelete(item.id!);
                                    }}
                                    onCancel={(e) => e?.stopPropagation()}
                                    okText="Да"
                                    cancelText="Нет"
                                >
                                    <Button
                                        icon={<DeleteOutlined />}
                                        danger
                                        shape="circle"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Popconfirm>
                            </Flex>
                        </Flex>
                    </Card>
                </List.Item>
            )}
        />
    );
};
