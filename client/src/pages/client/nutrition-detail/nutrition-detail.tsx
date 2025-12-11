import { Link, useParams } from 'react-router-dom';

export const NutritionDetail = () => {
    const { nutritionId } = useParams();

    return (
        <div>
            <h1>Детали плана питания #{nutritionId}</h1>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <Link to="/client/nutrition">
                    <button>← Назад к питанию</button>
                </Link>
                <Link to="/client">
                    <button>🏠 Главная</button>
                </Link>
            </div>

            <div>
                <h3>Завтрак:</h3>
                <p>Овсянка 100г, яйца 2 шт, тост</p>

                <h3>Обед:</h3>
                <p>Курица 150г, рис 100г, овощи</p>

                <h3>Ужин:</h3>
                <p>Рыба 200г, салат</p>
            </div>
        </div>
    );
};
