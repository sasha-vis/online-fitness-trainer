import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@shared/stores/user/user'
import { ReactNode } from 'react';

interface UnauthorizedOnlyRouteProps {
  children: ReactNode;
}

export const UnauthorizedOnlyRoute = ({ children }: UnauthorizedOnlyRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return (
      <Navigate
        to="/"
        state={{ message: 'Вы уже вошли в систему' }}
        replace
      />
    );
  }
  return <>{children}</>;
};