import { Link } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores';
import styles from './home.module.scss';

export const Home = () => {
    const { user, isAuthenticated } = useAuthStore();

    return (
        <div className={styles.homeContainer}>
            <div className={styles.welcomeSection}>
                <h1 className={styles.title}>
                    {isAuthenticated
                        ? `Добро пожаловать, ${user?.name || user?.email}!`
                        : 'Добро пожаловать в MyFit!'}
                </h1>

                {!isAuthenticated && (
                    <p className={styles.subtitle}>
                        Что бы начать пользоваться приложением, пожалуйста войдите в ваш
                        аккаунт.
                    </p>
                )}
            </div>

            {isAuthenticated ? (
                <div className={styles.actionCards}>
                    {user?.role === 'client' && (
                        <>
                            <Link to="/client/nutrition" className={styles.card}>
                                <div className={styles.cardIcon}>🥗</div>
                                <h3>План питания</h3>
                                <p>Следите за своим рационом</p>
                            </Link>
                            <Link to="/client/workouts" className={styles.card}>
                                <div className={styles.cardIcon}>💪</div>
                                <h3>План тренировок</h3>
                                <p>Просмотрите тренировки, назначенные тренером</p>
                            </Link>
                            <Link to="/client/progress" className={styles.card}>
                                <div className={styles.cardIcon}>📈</div>
                                <h3>Мой прогресс</h3>
                                <p>Отслеживайте свои результаты</p>
                            </Link>

                            <Link to="/client/trainer/chat" className={styles.card}>
                                <div className={styles.cardIcon}>💬</div>
                                <h3>Написать тренеру</h3>
                                <p>Задайте вопрос или поделитесь прогрессом</p>
                            </Link>
                        </>
                    )}

                    {user?.role === 'trainer' && (
                        <>
                            <Link to="/trainer/library" className={styles.card}>
                                <div className={styles.cardIcon}>📚</div>
                                <h3>Библиотека</h3>
                                <p>Справочник тренировок и питания</p>
                            </Link>
                            <Link to="/trainer/clients" className={styles.card}>
                                <div className={styles.cardIcon}>👥</div>
                                <h3>Мои клиенты</h3>
                                <p>Управляйте тренировками клиентов</p>
                            </Link>
                        </>
                    )}
                </div>
            ) : (
                <div className={styles.authSection}>
                    <div className={styles.authButtons}>
                        <Link to="/login" className={styles.authButton}>
                            Войти в аккаунт
                        </Link>
                        <Link
                            to="/signup"
                            className={`${styles.authButton} ${styles.primary}`}
                        >
                            Создать аккаунт
                        </Link>
                    </div>

                    <div className={styles.features}>
                        <h3>Возможности MyFit:</h3>
                        <ul className={styles.featuresList}>
                            <li>📋 Индивидуальные планы тренировок</li>
                            <li>🥗 Персональное питание</li>
                            <li>📈 Отслеживание прогресса</li>
                            <li>👥 Общение с тренером</li>
                            <li>📱 Удобный интерфейс</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};
