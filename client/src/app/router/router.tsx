import { Outlet, Route, Routes } from 'react-router-dom';
import { WorkoutTemplates } from '@/pages/trainer/trainer-library/workout-templates/workout-templates';
import { ExcerciseTemplates } from '@/pages/trainer/trainer-library/excercise-templates/excercise-templates';
import { TrainerLibrary } from '@/pages/trainer/trainer-library/trainer-library';
import {
    Home,
    PersonalAccount,
    Auth,
    ClientNutrition,
    ClientWorkouts,
    ClientProgress,
    ClientProfile,
    TrainerProfile,
    Chat,
    WorkoutDetail,
    NutritionDetail,
} from '@/pages';
import { Header, Footer } from '@/widgets';
import { ProtectedRoute } from './protected-route';
import { UnauthorizedOnlyRoute } from './unauthorized-only-route';
import { AuthLayout, BasicLayout } from '@/shared/layouts';

export const Router = () => {
    return (
        <Routes>
            <Route
                element={
                    <BasicLayout headerSlot={<Header />} footerSlot={<Footer />}>
                        <Outlet />
                    </BasicLayout>
                }
            >
                <Route index element={<Home />} />

                <Route
                    path="client"
                    element={
                        <ProtectedRoute requiredRoles={['client']}>
                            <Outlet />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="nutrition" element={<ClientNutrition />} />
                    <Route path="nutrition/:nutritionId" element={<NutritionDetail />} />
                    <Route path="workouts" element={<ClientWorkouts />} />
                    <Route path="workouts/:workoutId" element={<WorkoutDetail />} />
                    <Route path="progress" element={<ClientProgress />} />
                    <Route path="profile" element={<ClientProfile />} />
                    <Route path="trainer" element={<TrainerProfile />}>
                        <Route path="chat" element={<Chat />} />
                    </Route>
                </Route>

                <Route
                    path="trainer"
                    element={
                        <ProtectedRoute requiredRoles={['trainer']}>
                            <Outlet />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="clients"
                        element="Здесь будет рендериться список клиентов"
                    />
                    <Route path="library" element={<TrainerLibrary />} />
                    <Route
                        path="library/nutrition-templates"
                        element="nutrition templates"
                    />
                    <Route
                        path="library/workout-templates"
                        element={<WorkoutTemplates />}
                    />
                    <Route
                        path="library/excercise-templates"
                        element={<ExcerciseTemplates />}
                    />
                    <Route path="clients/:clientId" element="client profile page" />
                    <Route index element="clients overview" />
                    <Route path="workouts" element="тренировки с клиентами" />
                    <Route
                        path="workouts/:workoutId"
                        element="деталька тренировки с клиентом"
                    />
                    <Route path="nutrition" element="client nutrition page" />
                    <Route
                        path="nutrition/:nutritionId"
                        element="client nutrition plan"
                    />
                    <Route path="progress" element={<ClientProgress />} />
                    <Route path="chat" element="chat with a client" />
                    <Route index element={<Home />} />
                    <Route path="profile" element={<PersonalAccount />} />
                </Route>
            </Route>

            <Route
                element={
                    <UnauthorizedOnlyRoute>
                        <AuthLayout />
                    </UnauthorizedOnlyRoute>
                }
            >
                <Route path="login" element={<Auth />} />
                <Route path="signup" element={<Auth />} />
            </Route>

            <Route path="*" element={'NotFoundPage'} />
        </Routes>
    );
};
