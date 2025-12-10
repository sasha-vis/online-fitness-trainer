import { Outlet, Route, Routes } from 'react-router-dom';
import { TrainerWorkoutPage } from '@/pages/trainer-workout-page/trainer-workout-page';
import { TrainerWorkoutsTemplate } from '@/pages/trainer-workouts-template/trainer-workouts-template';
import { TrainerWorkoutsPlan } from '@/pages/trainer-workouts-plan/trainer-workouts-plan';
import {
    Home,
    PersonalAccount,
    Auth,
    ProgressPage,
    Nutrition,
    WorkoutPlan,
    Workout,
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
                    <Route path="nutrition" element={<Nutrition />} />
                    <Route path="workouts" element={<Outlet />}>
                        <Route index element={<WorkoutPlan />} />
                        <Route path=":id" element={<Workout />} />
                    </Route>
                    <Route path="progress" element={<ProgressPage />} />
                    <Route path="profile" element={<PersonalAccount />} />
                    <Route
                        path="trainer"
                        element="Тут будет профиль тренера и чат с тренером клиента"
                    />
                </Route>

                <Route
                    path="trainer"
                    element={
                        <ProtectedRoute requiredRoles={['trainer']}>
                            <Outlet />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Home />} />
                    <Route
                        path="nutrition"
                        element="Тут будет список планов питания, все тоже самое как и в тренировках должно быть"
                    />
                    <Route
                        path="workouts"
                        element={<TrainerWorkoutPage />}
                        // element="Тут будет список планов тренировок, включая детальную страницу определенной тренировки с аккордеоном для упражнений, в упражнении мы видим видео и описание. Также можно создавать редактировать и удалять как планы тренировок, так и тренировки и упражнения"
                    />
                    <Route
                        path="workouts/templates"
                        element={<TrainerWorkoutsTemplate />}
                    />
                    <Route path="workouts/plans" element={<TrainerWorkoutsPlan />} />

                    {/* </Route> */}
                    <Route path="progress" element="Тут будет прогресс всех клиентов" />
                    <Route path="profile" element={<PersonalAccount />} />
                    <Route
                        path="clients"
                        element="Тут будет список всех клиентов, с возможностью посмотреть детально инфо о них, включая их план тренировок, питания, прогресс и чат с ними"
                    />
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
