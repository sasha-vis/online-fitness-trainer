import { Row, Col, Card, Collapse, Button, Typography, Space } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FireOutlined,
} from '@ant-design/icons';
import { WorkoutListProps } from '@shared/stores/workout/workout-types';
import React from 'react';
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

// export const WorkoutList = ({ list, title }) => (
//     <div style={{ padding: '20px', background: '#f0f2f5' }}>
//         <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
//             {title}
//         </Title>
//         <Row gutter={[16, 16]} justify="center">
//             {list.map((item, index) => (
//                 <Col xs={24} sm={12} md={8} lg={6} key={index}>
//                     <Card
//                         hoverable
//                         style={{
//                             borderRadius: '8px',
//                             boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//                         }}
//                         cover={
//                             <div
//                                 style={{
//                                     height: '150px',
//                                     background: '#1890ff',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                 }}
//                             >
//                                 <FireOutlined
//                                     style={{ fontSize: '50px', color: '#fff' }}
//                                 />
//                             </div>
//                         }
//                         actions={
//                             <Space>
//                                 <Button type="primary" icon={<EyeOutlined />}>
//                                     Просмотр
//                                 </Button>
//                                 <Button icon={<EditOutlined />}>Редактировать</Button>
//                                 <Button danger icon={<DeleteOutlined />}>
//                                     Удалить
//                                 </Button>
//                             </Space>
//                         }
//                     >
//                         <Card.Meta
//                             title={<Text strong>{item.name}</Text>}
//                             description={
//                                 <Text ellipsis={{ rows: 2 }}>{item.description}</Text>
//                             }
//                         />
//                         <Collapse accordion style={{ marginTop: '16px' }}>
//                             <Panel header="Детали упражнений" key="1">
//                                 {item.exercises.map((ex, exIndex) => (
//                                     <div key={exIndex} style={{ marginBottom: '8px' }}>
//                                         <Text strong>{ex.name}</Text>: {ex.reps} <br />
//                                         <Text type="secondary">{ex.description}</Text>
//                                     </div>
//                                 ))}
//                             </Panel>
//                         </Collapse>
//                     </Card>
//                 </Col>
//             ))}
//         </Row>
//     </div>
// );

export const WorkoutList: React.FC<WorkoutListProps> = ({
    list,
    title,
    onEdit,
    onDelete,
}) => (
    <div style={{ padding: '20px', background: '#f0f2f5' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
            {title}
        </Title>
        <Row gutter={[16, 16]} justify="center">
            {list.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.id || item.name}>
                    <Card
                        hoverable
                        style={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        }}
                        cover={
                            <div
                                style={{
                                    height: '150px',
                                    background: '#1890ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <FireOutlined
                                    style={{ fontSize: '50px', color: '#fff' }}
                                />
                            </div>
                        }
                        actions={[
                            <Space>
                                <Button icon={<EyeOutlined />}>Просмотр</Button>
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => onEdit(item)}
                                >
                                    Редактировать
                                </Button>
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => item.id && onDelete(item.id)}
                                >
                                    Удалить
                                </Button>
                            </Space>,
                        ]}
                    >
                        <Card.Meta
                            title={<Text strong>{item.name}</Text>}
                            description={
                                <Paragraph
                                    ellipsis={{
                                        rows: 2,
                                        expandable: true,
                                        symbol: 'еще',
                                    }}
                                >
                                    {item.description}
                                </Paragraph>
                            }
                        />
                        <Collapse accordion style={{ marginTop: '16px' }}>
                            <Panel header="Упражнения" key="1">
                                {item.exercises?.map((ex, idx) => (
                                    <div key={idx} style={{ marginBottom: '8px' }}>
                                        <Text strong>{ex.name}</Text>: {ex.reps}, Отдых:{' '}
                                        {ex.rest} сек <br />
                                        <Text type="secondary">{ex.count}</Text>
                                    </div>
                                )) || 'Нет упражнений'}
                            </Panel>
                        </Collapse>
                    </Card>
                </Col>
            ))}
        </Row>
    </div>
);
