// import { useState } from 'react';
// import { Card, Button, List, Typography, Space } from 'antd';
// import { WorkoutTemplates } from '../workout-templates/workout-templates'

// export const WorkoutPlanEditor = ({
//   initialPlan,
//   onPlanChange,
//   onAssignPlan,
//   editable = true
// }) => {
//   const [plan, setPlan] = useState(initialPlan);
//   const [modalState, setModalState] = useState({ visible: false, dayIdx: null, sectionIdx: null });

//   const addExercise = (dayIdx: any, sectionIdx: any) => {
//     setModalState({ visible: true, dayIdx, sectionIdx });
//   };

//   const handleSaveExercise = (values: any) => {
//     setPlan((prev: any) => {
//       const newPlan = { ...prev };
//       (modalState && modalState.dayIdx && modalState.sectionIdx) && newPlan.workouts[modalState.dayIdx].sections[modalState.sectionIdx].exercises.push({
//         name: values.exerciseName,
//         sets: values.sets,
//         reps: String(values.reps),
//       });
//       return newPlan;
//     });
//     setModalState({ visible: false, dayIdx: null, sectionIdx: null });
//     if (onPlanChange) onPlanChange(plan);
//   };

//   const removeExercise = (dayIdx: any, sectionIdx: any, exIdx: any) => {
//     setPlan((prev: any) => {
//       const newPlan = { ...prev };
//       newPlan.workouts[dayIdx].sections[sectionIdx].exercises.splice(exIdx, 1);
//       return newPlan;
//     });
//     if (onPlanChange) onPlanChange(plan);
//   };

//   // Аналогично реализуйте addDay, addSection, removeSection, removeDay

//   return (
//     <Card title={plan.goal}>
//       {plan.workouts.map((workout: any, dayIdx: any) => (
//         <Card key={workout.id} type="inner" title={`День ${dayIdx + 1}`}>
//           {workout.sections.map((section: any, sectionIdx: any) => (
//             <div key={section.title} style={{ marginBottom: 16 }}>
//               <Typography.Text strong>{section.title}</Typography.Text>
//               <List
//                 dataSource={section.exercises}
//                 renderItem={(ex: any, exIdx) => (
//                   <List.Item
//                     actions={editable ? [
//                       <Button danger type="link" onClick={() => removeExercise(dayIdx, sectionIdx, exIdx)}>
//                         Удалить
//                       </Button>
//                     ] : []}
//                   >
//                     {ex.name} — {ex.sets}x{ex.reps}
//                   </List.Item>
//                 )}
//               />
//               {editable && (
//                 <Button onClick={() => addExercise(dayIdx, sectionIdx)}>
//                   + Добавить упражнение
//                 </Button>
//               )}
//             </div>
//           ))}
//         </Card>
//       ))}
//       <WorkoutTemplates
//         onSave={handleSaveExercise}
//         // visible={modalState.visible}
//         // onCancel={() => setModalState({ visible: false, dayIdx: null, sectionIdx: null })}
//       />
//       <Space style={{ marginTop: 24 }}>
//         {editable && (
//           <Button type="primary" onClick={() => onAssignPlan(plan)}>
//             Назначить план тренировок
//           </Button>
//         )}
//       </Space>
//     </Card>
//   );
// };
