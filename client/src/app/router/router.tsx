import { Outlet, Route, Routes } from 'react-router-dom';
import {
    Home,
    PersonalAccount,
    Auth,
    Chat,
    Nutrition,
    Workouts,
    WorkoutDetail,
    NutritionDetail,
    Progress,
    TrainerProfile,
    TrainerLibrary,
    NutritionTemplates,
    WorkoutTemplates,
    MealsLibrary,
    ExercisesLibrary,
    ClientList,
    ClientDetail,
    WorkoutPlanEditor,
    NutritionForm,
    NutritionDetailForm,
    ClientProgress,
    NotFound,
    ReportsPage,
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
                    <Route path="nutrition/:nutritionId" element={<NutritionDetail />} />
                    <Route path="workouts" element={<Workouts />} />
                    <Route path="workouts/:workoutId" element={<WorkoutDetail />} />
                    <Route path="progress" element={<Progress />} />
                    <Route path="progress/reports" element={<ReportsPage />} />
                    <Route path="profile" element={<PersonalAccount />} />
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
                    <Route index element={<Home />} />

                    <Route path="library" element={<TrainerLibrary />}>
                        <Route
                            path="nutrition-templates"
                            element={<NutritionTemplates />}
                        />
                        <Route path="workout-templates" element={<WorkoutTemplates />} />
                        <Route path="meals" element={<MealsLibrary />} />
                        <Route path="exercises" element={<ExercisesLibrary />} />
                    </Route>

                    <Route path="clients" element={<ClientList />} />
                    <Route path="clients/:clientId" element={<ClientDetail />}>
                        <Route path="workout-plan" element={<WorkoutPlanEditor />} />
                        {/* <Route
                            path="workouts/:workoutId"
                            element={<WorkoutDetailForm />}
                        /> */}
                        <Route path="nutrition" element={<NutritionForm />} />
                        <Route
                            path="nutrition/:nutritionId"
                            element={<NutritionDetailForm />}
                        />

                        <Route path="progress" element={<ClientProgress />} />
                        <Route path="chat" element={<Chat />} />
                    </Route>

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

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
