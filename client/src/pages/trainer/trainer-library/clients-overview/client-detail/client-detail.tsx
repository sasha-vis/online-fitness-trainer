// import { useParams } from "react-router-dom";
// import { useEffect } from "react";
import {
    Card,
    Avatar,
    // Button,
    // Typography,
    Tabs,
    // Modal,
    // message
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
// import { useTrainerStore } from '@shared/stores/trainer/trainer';
// import { useAuthStore } from '@/shared/stores/user/user';
// import { WorkoutPlanEditor } from "../tempororary-component";
// import { workoutPlan } from '@pages/client/workout-detail/workout-plan-mock';
import { ExcerciseTemplates } from '@pages/trainer/trainer-library/excercise-templates/excercise-templates';

export const ClientDetail = () => {
    // const { id } = useParams();
    // const {
    //   selectedClient,
    //   fetchClient,
    //   assignTrainer,
    //   removeTrainer,
    //   assignPlan
    // } = useTrainerStore();
    // const { user } = useAuthStore();

    // useEffect(() => { fetchClient(id); }, [id]);

    // if (!selectedClient) return "Loading...";

    // const isTrainer = (user && user.id) && selectedClient.trainerId === user.id;

    // const handleAssignTrainer = async () => {
    //   await assignTrainer(selectedClient.id, user);
    //   message.success("Вы назначены тренером клиента");
    // };

    // const handleRemoveTrainer = async () => {
    //   await removeTrainer(selectedClient.id);
    //   message.success("Тренер удалён");
    // };

    // const handleAssignPlan = async (planType: string, planData) => {
    //   await assignPlan(selectedClient.id, planType, planData);
    //   message.success("План назначен");
    // };

    return (
        <Card>
            <Avatar size={80} icon={<UserOutlined />} />
            {/* <Typography.Title>{selectedClient.name}</Typography.Title>
      <Typography.Text>{selectedClient.email}</Typography.Text>
      <div style={{ marginTop: 20 }}>
        {selectedClient.trainerId ? (
          <>
            <Typography.Text>
              Тренер: {selectedClient.trainerName} ({selectedClient.trainerEmail})
            </Typography.Text>
            {isTrainer && (
              <Button danger onClick={handleRemoveTrainer} style={{ marginLeft: 16 }}>
                Удалить тренера
              </Button>
            )}
          </>
        ) : (
          <Button type="primary" onClick={handleAssignTrainer}>
            Назначить тренера
          </Button>
        )}
      </div> */}
            <Tabs defaultActiveKey="nutrition">
                <Tabs.TabPane tab="Питание" key="nutrition">
                    {/* <NutritionPlanPicker
            value={selectedClient.nutritionPlan}
            onSelect={(plan) => handleAssignPlan('nutritionPlan', plan)}
          /> */}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Тренировки" key="workout">
                    {/* <WorkoutPlanEditor
            // value={selectedClient.workoutPlan}
            // onSelect={(plan) => handleAssignPlan('workoutPlan', plan)}
            initialPlan={workoutPlan}
            // onPlanChange={(newPlan) => {/* можно синкать в zustand, если нужно */}
                    {/* onAssignPlan={(plan) => handleAssignPlan('workoutPlan', plan)}
            editable={true}
          /> */}
                    <ExcerciseTemplates />
                </Tabs.TabPane>
            </Tabs>
        </Card>
    );
};
