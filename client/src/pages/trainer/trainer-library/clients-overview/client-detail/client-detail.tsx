import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Avatar, Button, Typography, message, Space, Tabs } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useTrainerStore } from '@shared/stores/trainer/trainer';
import { useAuthStore } from '@/shared/stores/user/user';
import { WorkoutPlanModal } from '@widgets/workout-plan-modal/workout-plan-modal';
import { WorkoutPlanEditor } from '../../workout-plan-editor/workout-plan-editor';
import { WorkoutPlanView } from '../../workout-templates/workout-templates-preview';
import { useWorkoutStore } from '@shared/stores/workout/workout';
import { AssignPlanButton } from '../../workout-templates/assign-plan-btn';


export const ClientDetail = () => {
    const { id } = useParams();
    const {
      selectedClient,
      fetchClient,
      assignTrainer,
      removeTrainer,
      assignPlan
    } = useTrainerStore();
    const { user } = useAuthStore();
    const { editingPlan, setSelectedPlan } = useWorkoutStore();

    const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
    const [showEditor, setShowEditor] = useState(false);

    useEffect(() => { fetchClient(id); }, [id]);

    if (!selectedClient) return "Loading...";

    const isTrainer = (user && user.id) && selectedClient.trainerId === user.id;

    const handleAssignTrainer = async () => {
      await assignTrainer(selectedClient.id, user);
      message.success("Вы назначены тренером клиента");
    };

    const handleRemoveTrainer = async () => {
      await removeTrainer(selectedClient.id);
      message.success("Тренер удалён");
    };
    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setWorkoutModalVisible(false);
        setShowEditor(true);
    };
    // const handleAssignPlan = async (planType: string, planData) => {
    //   await assignPlan(selectedClient.id, planType, planData);
    //   message.success("План назначен");
    // };
    const handleAssignWorkoutPlan = async (plan) => {
      await assignPlan(selectedClient.id, 'workoutPlan', plan);
      message.success('План тренировок назначен');
    };

    // const handleAssignNutritionPlan = async (plan) => {
    //   await assignPlan(selectedClient.id, 'nutritionPlan', plan);
    //   message.success('План питания назначен');
    // };

    // return (
    //     <Card>
    //         <Avatar size={80} icon={<UserOutlined />} />
    //         <Typography.Title>{selectedClient.name}</Typography.Title>
    //   <Typography.Text>{selectedClient.email}</Typography.Text>
    //   <div style={{ marginTop: 20 }}>
    //     {selectedClient.trainerId ? (
    //       <>
    //         <Typography.Text>
    //           Тренер: {selectedClient.trainerName} ({selectedClient.trainerEmail})
    //         </Typography.Text>
    //         {isTrainer && (
    //           <Button danger onClick={handleRemoveTrainer} style={{ marginLeft: 16 }}>
    //             Удалить тренера
    //           </Button>
    //         )}
    //       </>
    //     ) : (
    //       <Button type="primary" onClick={handleAssignTrainer}>
    //         Назначить тренера
    //       </Button>
    //     )}
    //   </div>
    //         <Tabs defaultActiveKey="nutrition">
    //             <Tabs.TabPane tab="Питание" key="nutrition">
    //                 {/* <NutritionPlanPicker
    //         value={selectedClient.nutritionPlan}
    //         onSelect={(plan) => handleAssignPlan('nutritionPlan', plan)}
    //       /> */}
    //             </Tabs.TabPane>
    //             <Tabs.TabPane tab="Тренировки" key="workout">
    //                 <ExcerciseTemplates />
    //             </Tabs.TabPane>
    //         </Tabs>
    //     </Card>
    // );
    return (
      <Card style={{ maxWidth: 800, margin: 'auto' }}>
      <Avatar size={80} icon={<UserOutlined />} />
      <Typography.Title level={2}>{selectedClient.name}</Typography.Title>
      <Typography.Text>{selectedClient.email}</Typography.Text>

      <div style={{ marginTop: 20 }}>
        {selectedClient.trainerId ? (
          <Space>
            <Typography.Text>
              Тренер: {selectedClient.trainerName} ({selectedClient.trainerEmail})
            </Typography.Text>
            {isTrainer && (
              <Button danger onClick={handleRemoveTrainer}>
                Удалить тренера
              </Button>
            )}
          </Space>
        ) : (
          <Button type="primary" onClick={handleAssignTrainer}>
            Назначить тренера
          </Button>
        )}
      </div>

      <div style={{ marginTop: 30 }}>
                <Tabs defaultActiveKey="workout">
                    <Tabs.TabPane tab="Тренировки" key="workout">
                        <div style={{ marginBottom: 16 }}>
                            {!showEditor ? (
                                <Button 
                                    type="primary" 
                                    onClick={() => setWorkoutModalVisible(true)}
                                >
                                    {selectedClient.workoutPlan ? 'Изменить план тренировок' : 'Назначить план тренировок'}
                                </Button>
                            ) : (
                                <Space>
                                    <AssignPlanButton 
                                        clientId={selectedClient.id} 
                                        onSuccess={() => {
                                            setShowEditor(false);
                                            fetchClient(id); // Обновляем данные клиента
                                        }} 
                                    />
                                    <Button onClick={() => setShowEditor(false)}>
                                        Отмена
                                    </Button>
                                </Space>
                            )}
                        </div>

                        {showEditor ? (
                            <WorkoutPlanEditor />
                        ) : selectedClient.workoutPlan ? (
                            <WorkoutPlanView plan={selectedClient.workoutPlan} />
                        ) : (
                            <Typography.Text type="secondary">
                                План тренировок не назначен
                            </Typography.Text>
                        )}
                    </Tabs.TabPane>
                    
                    {/* Можно добавить другие вкладки */}
                    <Tabs.TabPane tab="Питание" key="nutrition">
                        {/* Компоненты для плана питания */}
                    </Tabs.TabPane>
                </Tabs>
            </div>

            <WorkoutPlanModal
                visible={workoutModalVisible}
                onClose={() => setWorkoutModalVisible(false)}
                onSelect={handlePlanSelect}
            />
    </Card>
    )
  };
