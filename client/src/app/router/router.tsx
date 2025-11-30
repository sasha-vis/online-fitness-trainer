import { Outlet, Route, Routes } from 'react-router-dom';
import { Home } from '@/pages';
import { Header, Footer } from '@/widgets';
import { ProtectedRoute } from './protected-route';
import { UnauthorizedOnlyRoute } from './unauthorized-only-route';
import { AuthLayout, BasicLayout } from '@/shared/layouts';
import { Auth } from '@/pages/auth';

export const Router = () => {
    return (
        <>
            <Routes>
                <Route
                    element={
                        <BasicLayout headerSlot={<Header />} footerSlot={<Footer />}>
                            <Outlet />
                        </BasicLayout>
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="nutrition" element="NutritionPage" />
                    <Route path="progress" element="ProgressPage" />
                    <Route
                        path="profile"
                        element={<ProtectedRoute>ProfilePage</ProtectedRoute>}
                    />
                    <Route
                        path="client"
                        element={
                            <ProtectedRoute requiredRoles={['client']}>
                                client-page
                                <Outlet />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Home />} />
                        <Route path="nutrition" element="client-nutrition-page" />
                        <Route path="progress" element="client-progress-page" />
                        <Route path="profile" element="client-profile-page" />
                        <Route path="trainer" element="client-trainer-page" />
                    </Route>

                    <Route
                        path="trainer"
                        element={
                            <ProtectedRoute requiredRoles={['trainer']}>
                                trainer-page
                                <Outlet />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Home />} />
                        <Route path="clients" element="trainer-client-page" />
                        <Route path="progress" element="trainer-progres-page" />
                        <Route path="profile" element="trainer-profile-page" />
                        <Route path="nutrition" element="trainer-nutrition-page" />
                    </Route>
                </Route>
                <Route element={<AuthLayout />}>
                    <Route
                        path="login"
                        element={
                            <UnauthorizedOnlyRoute>
                                <Auth />
                            </UnauthorizedOnlyRoute>
                        }
                    />
                    <Route
                        path="signup"
                        element={
                            <UnauthorizedOnlyRoute>
                                <Auth />
                            </UnauthorizedOnlyRoute>
                        }
                    />
                </Route>
                <Route path="*" element={'NotFoundPage'} />
            </Routes>
        </>
    );
};
