import { List, Card, Flex, Typography, Empty, Tag, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface BodyMeasurement {
    id: string;
    clientId: string;
    createdAt: Date;
    updatedAt?: Date;
    arm?: number;
    chest?: number;
    hips?: number;
    leg?: number;
    waist?: number;
    weight?: number;
    photosUrl?: string[];
}

interface ProgressViewProps {
    reports: BodyMeasurement[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({ reports }) => {
    const getStatistics = () => {
        if (reports.length === 0) return null;

        const firstReport = reports[reports.length - 1];
        const lastReport = reports[0];

        const weightChange =
            lastReport.weight && firstReport.weight
                ? lastReport.weight - firstReport.weight
                : null;

        return {
            weightChange,
            periodInDays: Math.ceil(
                (new Date(lastReport.createdAt).getTime() -
                    new Date(firstReport.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
            ),
            totalReports: reports.length,
        };
    };

    const statistics = getStatistics();

    if (!reports || reports.length === 0) {
        return (
            <Empty
                description="Клиент еще не добавил отчеты о прогрессе"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    return (
        <div>
            {statistics && (
                <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
                    <Flex justify="space-between">
                        <div>
                            <Text strong>Всего отчетов: </Text>
                            <Tag color="blue">{statistics.totalReports}</Tag>
                        </div>
                        {statistics.weightChange !== null && (
                            <div>
                                <Text strong>Изменение веса: </Text>
                                <Tag
                                    color={
                                        statistics.weightChange > 0
                                            ? 'red'
                                            : statistics.weightChange < 0
                                              ? 'green'
                                              : 'blue'
                                    }
                                >
                                    {statistics.weightChange > 0 ? '+' : ''}
                                    {statistics.weightChange.toFixed(1)} кг
                                </Tag>
                            </div>
                        )}
                    </Flex>
                </Card>
            )}

            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={reports}
                renderItem={(item) => (
                    <List.Item>
                        <Card style={{ width: '100%' }}>
                            <Flex justify="space-between" align="center">
                                <Flex vertical style={{ width: '20%' }}>
                                    <Space>
                                        <CalendarOutlined />
                                        <Text strong>
                                            {item.createdAt
                                                ? new Date(
                                                      item.createdAt
                                                  ).toLocaleDateString('ru-RU', {
                                                      day: 'numeric',
                                                      month: 'long',
                                                      year: 'numeric',
                                                  })
                                                : 'Дата не указана'}
                                        </Text>
                                    </Space>
                                    {item.weight && (
                                        <Tag color="blue" style={{ marginTop: 8 }}>
                                            Вес: {item.weight} кг
                                        </Tag>
                                    )}
                                </Flex>

                                <Flex justify="space-around" style={{ width: '60%' }}>
                                    <Flex vertical>
                                        {item.arm && (
                                            <Text>
                                                Обхват руки:{' '}
                                                <Text strong>{item.arm}</Text> см
                                            </Text>
                                        )}
                                        {item.chest && (
                                            <Text>
                                                Обхват груди:{' '}
                                                <Text strong>{item.chest}</Text> см
                                            </Text>
                                        )}
                                        {item.hips && (
                                            <Text>
                                                Обхват бёдер:{' '}
                                                <Text strong>{item.hips}</Text> см
                                            </Text>
                                        )}
                                    </Flex>
                                    <Flex vertical>
                                        {item.leg && (
                                            <Text>
                                                Обхват ног: <Text strong>{item.leg}</Text>{' '}
                                                см
                                            </Text>
                                        )}
                                        {item.waist && (
                                            <Text>
                                                Обхват талии:{' '}
                                                <Text strong>{item.waist}</Text> см
                                            </Text>
                                        )}
                                    </Flex>
                                </Flex>

                                {item.photosUrl && item.photosUrl.length > 0 && (
                                    <Flex vertical style={{ width: '20%' }}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Фото: {item.photosUrl.length}
                                        </Text>
                                    </Flex>
                                )}
                            </Flex>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};
