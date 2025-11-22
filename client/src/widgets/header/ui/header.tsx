import { NavLink, useNavigate } from "react-router-dom"
import styles from './header.module.scss'
import { useAuthStore } from "@/shared/stores/user/user";
import { Button } from "antd";

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className={styles.header}>
      <nav className={styles.left}>
        <NavLink to="/">Главная </NavLink>
        <NavLink to="/nutrition">Питание </NavLink>
        <NavLink to="/progress">Прогресс </NavLink>
        <div className={styles.center}>
        {isAuthenticated && (
          <NavLink to="/profile">
            <p>Avatar</p>
          </NavLink>
        )}
        </div>
        <div className={styles.right}>
        {isAuthenticated && user ? (
          <>
            <span className={styles.role}>
              {user.role === 'trainer' ? 'Тренер' : 'Клиент'}
            </span>
            <NavLink to="/profile">Профиль</NavLink>
            <Button onClick={handleLogout}>Выйти</Button>
          </>
        ) : (
          <NavLink to="/login">Войти</NavLink>
        )}
      </div>
      </nav>
    </header>
  )
}
