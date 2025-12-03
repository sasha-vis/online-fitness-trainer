import { Table, List, Typography } from 'antd';
import { ProgressReport } from '@shared/stores/user/progress/progress-types';

const { Text } = Typography;

export const CommentsList = ({ data }: { data: ProgressReport[] }) => {
    const columns = [
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
            width: 150,
        },
        {
            title: 'Комментарии тренера',
            dataIndex: 'comments',
            key: 'comments',
            render: (comments: { id: number; text: string }[]) => (
                <List
                    size="small"
                    dataSource={comments}
                    renderItem={(item) => (
                        <List.Item key={item.id}>
                            <Text>{item.text}</Text>
                        </List.Item>
                    )}
                    locale={{ emptyText: 'Комментариев нет' }}
                />
            ),
        },
    ];
    return (
        <Table
            dataSource={data}
            columns={columns}
            rowKey="id"
            pagination={false}
            locale={{ emptyText: 'Нет данных за выбранный период' }}
        />
    );
};
