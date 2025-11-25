import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@shared/stores/user/user'
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
}

export type UserRole = 'trainer' | 'client';

export const ProtectedRoute = ({ requiredRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: 'Для просмотра информации о пользователе необходимо войти в систему' }}
        replace
      />
    );
  }
  if (requiredRoles && (!user || !requiredRoles.includes(user.role))) {
    return <Navigate to="/" state={{ message: 'Нет доступа' }} replace />;
  }
  return <Outlet />;
};
