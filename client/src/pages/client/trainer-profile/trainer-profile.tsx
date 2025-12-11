import { Link, Outlet } from 'react-router-dom';

export const TrainerProfile = () => {
    return (
        <div>
            <h1>Мой тренер</h1>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <Link to="/client">
                    <button>🏠 Главная</button>
                </Link>
                <Link to="/client/nutrition">
                    <button>🥗 Питание</button>
                </Link>
                <Link to="/client/workouts">
                    <button>💪 Тренировки</button>
                </Link>
                <Link to="/client/progress">
                    <button>📈 Прогресс</button>
                </Link>
                <Link to="/client/profile">
                    <button>👤 Профиль</button>
                </Link>
            </div>

            <div
                style={{
                    border: '1px solid #ddd',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <h3 style={{ marginTop: 0 }}>Алексей Петров</h3>
                <p>
                    <strong>Специализация:</strong> Силовой тренинг, похудение
                </p>
                <p>
                    <strong>Опыт:</strong> 5 лет
                </p>
                <p>
                    <strong>Образование:</strong> Институт физкультуры
                </p>
                <p>
                    <strong>Контакт:</strong> +7 999 987-65-43
                </p>
                <p>
                    <strong>Email:</strong> alexey@trainer.com
                </p>

                <div style={{ marginTop: '20px' }}>
                    <Link to="chat">
                        <button>💬 Написать сообщение</button>
                    </Link>
                </div>
            </div>

            {/* Здесь рендерится вложенный роут /chat */}
            <Outlet />
        </div>
    );
};
