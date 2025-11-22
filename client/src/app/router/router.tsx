import { Outlet, Route, Routes } from 'react-router-dom';
import { Home } from '@/pages/home/home';
import { BasicLayout } from '@/shared/layouts/basic-layout/basic-layout';
import { Header } from '@/widgets/header/ui/header';
import { Footer } from '@/widgets/footer/footer';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import {  UnauthorizedOnlyRoute } from '@/features/auth/UnauthorizedOnlyRoute'

export const Router = () => {
	return (
        <>
            <Routes>
                <Route element={
                    <BasicLayout headerSlot={<Header />} footerSlot={<Footer />}>
                        <Outlet />
                    </BasicLayout>   
                }
                >
                    <Route index element={<Home />} />
                    <Route path="nutrition" element={"NutritionPage"} />
                    <Route path="progress" element={"ProgressPage"} />
                    <Route
                        path="profile"
                        element={
                        <ProtectedRoute>
                            ProfilePage
                        </ProtectedRoute>
                        }
                    />
                    <Route
                        path="login"
                        element={
                        <UnauthorizedOnlyRoute>
                            LoginPage
                        </UnauthorizedOnlyRoute>
                        }
                    />
                    <Route
                        path="client"
                        element={
                        <ProtectedRoute requiredRoles={['client']}>
                            MePage
                        </ProtectedRoute>
                        }
                    />
                    <Route
                        path="client/nutrition"
                        element={
                        <ProtectedRoute requiredRoles={['client']}>
                            MeNutritionPage
                        </ProtectedRoute>
                        }
                    />
                    <Route
                        path="client/progress"
                        element={
                        <ProtectedRoute requiredRoles={['client']}>
                            MeProgressPage
                        </ProtectedRoute>
                        }
                    />
                    <Route
                        path="client/trainer"
                        element={
                        <ProtectedRoute requiredRoles={['client']}>
                            MeTrainerPage
                        </ProtectedRoute>
                        }
                    />

                    {/* protected: тренер */}
                    <Route
                        path="coach"
                        element={
                        <ProtectedRoute requiredRoles={['trainer']}>
                            CoachPage
                        </ProtectedRoute>
                        }
                    />
                    <Route
                        path="coach/clients"
                        element={
                        <ProtectedRoute requiredRoles={['trainer']}>
                            CoachClientsPage
                        </ProtectedRoute>
                        }
                    />
                    <Route
                        path="coach/progress"
                        element={
                        <ProtectedRoute requiredRoles={['trainer']}>
                            CoachProgressPage
                        </ProtectedRoute>
                        }
                    />
                </Route>
                {/* 404 */}
                <Route path="*" element={"NotFoundPage"} />
            </Routes>
        </>
    );
};