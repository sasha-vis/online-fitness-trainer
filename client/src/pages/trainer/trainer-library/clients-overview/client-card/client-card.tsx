// import { Card, Avatar, Typography, Button } from 'antd';
// import { UserOutlined } from '@ant-design/icons';
// import { NavLink } from 'react-router-dom';

// export const ClientCard = ({ client, onAssignTrainer, trainer, onAssignPlan }) => (
//   <NavLink to={client.id}>
//     <Card
//         style={{ width: 300, margin: 16 }}
//         hoverable
//         actions={[
//         !client.trainerId ? (
//             <Button type="primary" onClick={() => onAssignTrainer(client.id)}>
//             Назначить тренера
//             </Button>
//         ) : (
//             <Typography.Text type="success">Тренер назначен</Typography.Text>
//         ),
//         <Button onClick={() => onAssignPlan(client.id)}>Назначить план</Button>,
//         ]}
//     >
//         <Card.Meta
//         avatar={<Avatar icon={<UserOutlined />} />}
//         title={<Typography.Text strong>{client.name}</Typography.Text>}
//         description={<Typography.Text type="secondary">{client.email}</Typography.Text>}
//         />
//         <div style={{ marginTop: 12 }}>
//         {client.trainerId ? (
//             <Typography.Text>
//             Тренер: <Typography.Text strong>{client.trainerName}</Typography.Text> ({client.trainerEmail})
//             </Typography.Text>
//         ) : (
//             <Typography.Text type="danger">Тренер не назначен</Typography.Text>
//         )}
//         </div>
//     </Card>
//   </NavLink>
// );
