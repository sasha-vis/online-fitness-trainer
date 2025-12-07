import { Outlet, Route, Routes } from 'react-router-dom';
import { Home, PersonalAccount, Auth } from '@/pages';
import { Header, Footer } from '@/widgets';
import { ProtectedRoute } from './protected-route';
import { UnauthorizedOnlyRoute } from './unauthorized-only-route';
import { AuthLayout, BasicLayout } from '@/shared/layouts';

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

                    <Route
                        path="client"
                        element={
                            <ProtectedRoute requiredRoles={['client']}>
                                <Outlet />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Home />} />
                        <Route
                            path="nutrition"
                            element="Тут будет план питания клиента"
                        />
                        <Route
                            path="workouts"
                            element="Тут будет план тренировок клиента, включая детальную страницу определенной тренировки с аккордеоном для упражнений, в упражнении мы видим видео и описание"
                        />
                        <Route path="progress" element="Тут будет прогресс клиента" />
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
                            element="Тут будет список планов тренировок, включая детальную страницу определенной тренировки с аккордеоном для упражнений, в упражнении мы видим видео и описание. Также можно создавать редактировать и удалять как планы тренировок, так и тренировки и упражнения"
                        />
                        <Route
                            path="progress"
                            element="Тут будет прогресс всех клиентов"
                        />
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
        </>
    );
};
