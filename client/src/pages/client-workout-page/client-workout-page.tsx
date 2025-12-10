// import React, { useEffect, useState } from 'react';
// import { Tabs, Table, Spin } from 'antd';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db, auth } from '../../firebase';

// const { TabPane } = Tabs;

// const days = [
//     'понедельник',
//     'вторник',
//     'среда',
//     'четверг',
//     'пятница',
//     'суббота',
//     'воскресенье',
// ];

// const columns = [
//     { title: 'Упражнение', dataIndex: 'exerciseName', key: 'exerciseName' },
//     { title: 'Повторения', dataIndex: 'reps', key: 'reps' },
//     { title: 'Подходы', dataIndex: 'sets', key: 'sets' },
//     { title: 'Отдых (сек)', dataIndex: 'rest', key: 'rest' },
//     { title: 'Группа мышц', dataIndex: 'muscleGroup', key: 'muscleGroup' },
// ];

// export const ClientWorkoutPage = () => {
//     const [schedule, setSchedule] = useState<Record<string, string>>({});
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchWorkouts = async () => {
//             const user = auth.currentUser;
//             if (!user) return;
//             const q = query(
//                 collection(db, 'workouts'),
//                 where('assignedToUid', '==', user.uid)
//             );
//             const snapshot = await getDocs(q);
//             if (!snapshot.empty) {
//                 const data = snapshot.docs[0].data(); // Предполагаем один план на клиента
//                 setSchedule(data.schedule || {});
//             }
//             setLoading(false);
//         };
//         fetchWorkouts();
//     }, []);

//     if (loading) return <Spin />;

//     return (
//         <Tabs defaultActiveKey="monday">
//             {days.map((day) => (
//                 <TabPane tab={day.charAt(0).toUpperCase() + day.slice(1)} key={day}>
//                     <Table
//                         columns={columns}
//                         dataSource={schedule[day] || []}
//                         rowKey="exerciseName"
//                     />
//                 </TabPane>
//             ))}
//         </Tabs>
//     );
// };
