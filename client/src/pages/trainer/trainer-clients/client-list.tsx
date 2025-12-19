import { useEffect, useState, useMemo, useCallback } from 'react';
import {
    Row,
    Col,
    Spin,
    Alert,
    Input,
    Select,
    Card,
    Typography,
    Space,
    Button,
} from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTrainerStore } from '@shared/stores/trainer/trainer';
import { ClientCard } from './client-card';
import { useAuthStore } from '@/shared/stores/user/user';

const { Search } = Input;
const { Option } = Select;

export const ClientList = () => {
    const { clients, fetchClients, loading, error } = useTrainerStore();
    const { user } = useAuthStore();

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Получаем значения из URL или используем значения по умолчанию
    const initialSearchText = searchParams.get('search') || '';
    const initialFilterType = searchParams.get('filter') || 'all';
    const initialShowFilters = searchParams.get('showFilters') === 'true';

    const [searchText, setSearchText] = useState(initialSearchText);
    const [filterType, setFilterType] = useState(initialFilterType);
    const [showFilters, setShowFilters] = useState(initialShowFilters);

    // Функция для обновления URL параметров
    const updateUrlParams = useCallback(
        (updates: { search?: string; filter?: string; showFilters?: boolean }) => {
            const params = new URLSearchParams(searchParams);

            if (updates.search !== undefined) {
                if (updates.search) {
                    params.set('search', updates.search);
                } else {
                    params.delete('search');
                }
            }

            if (updates.filter !== undefined) {
                if (updates.filter !== 'all') {
                    params.set('filter', updates.filter);
                } else {
                    params.delete('filter');
                }
            }

            if (updates.showFilters !== undefined) {
                if (updates.showFilters) {
                    params.set('showFilters', 'true');
                } else {
                    params.delete('showFilters');
                }
            }

            // Используем navigate для обновления URL без перезагрузки
            navigate({ search: params.toString() }, { replace: true });
        },
        [searchParams, navigate]
    );

    useEffect(() => {
        fetchClients();
    }, []);

    // Обновление URL при изменении фильтров
    useEffect(() => {
        updateUrlParams({
            search: searchText,
            filter: filterType,
            showFilters,
        });
    }, [searchText, filterType, showFilters, updateUrlParams]);

    // Фильтрация клиентов
    const filteredClients = useMemo(() => {
        let result = [...clients];

        // Фильтр по типу
        if (filterType === 'my') {
            result = result.filter((client) => client.trainerId === user?.id);
        } else if (filterType === 'without') {
            result = result.filter((client) => !client.trainerId);
        }

        // Поиск по имени/email
        if (searchText.trim()) {
            const searchLower = searchText.toLowerCase();
            result = result.filter(
                (client) =>
                    client.name?.toLowerCase().includes(searchLower) ||
                    client.email?.toLowerCase().includes(searchLower)
            );
        }

        return result;
    }, [clients, filterType, searchText, user?.id]);

    const handleRefresh = () => {
        fetchClients();
    };

    const handleClearFilters = () => {
        setSearchText('');
        setFilterType('all');
        setShowFilters(false);
        // Очищаем все параметры из URL
        navigate({ search: '' }, { replace: true });
    };

    const handleSearchChange = (value: string) => {
        setSearchText(value);
    };

    const handleFilterChange = (value: string) => {
        setFilterType(value);
    };

    const toggleShowFilters = () => {
        setShowFilters((prev) => !prev);
    };

    if (loading)
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
                <Typography.Text
                    type="secondary"
                    style={{ marginTop: 16, display: 'block' }}
                >
                    Загрузка клиентов...
                </Typography.Text>
            </div>
        );

    if (error)
        return (
            <Alert
                type="error"
                message="Ошибка загрузки"
                description={error}
                action={
                    <Button size="small" onClick={fetchClients}>
                        Повторить
                    </Button>
                }
            />
        );

    return (
        <div>
            {/* Заголовок и кнопки управления */}
            <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 16,
                    }}
                >
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Список клиентов
                        <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                            ({filteredClients.length} из {clients.length})
                        </Typography.Text>
                    </Typography.Title>

                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleRefresh}
                            loading={loading}
                        >
                            Обновить
                        </Button>
                        <Button
                            icon={<FilterOutlined />}
                            type={showFilters ? 'primary' : 'default'}
                            onClick={toggleShowFilters}
                        >
                            Фильтры {showFilters ? '▼' : '▶'}
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* Панель фильтров */}
            {showFilters && (
                <Card
                    size="small"
                    style={{ marginBottom: 24, border: '1px solid #d9d9d9' }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Typography.Text strong>Поиск и фильтрация</Typography.Text>

                        <Space wrap style={{ width: '100%' }}>
                            <Search
                                placeholder="Поиск по имени или email"
                                allowClear
                                enterButton={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onSearch={handleSearchChange}
                                style={{ width: 300 }}
                            />

                            <Select
                                value={filterType}
                                onChange={handleFilterChange}
                                style={{ width: 200 }}
                            >
                                <Option value="all">Все клиенты</Option>
                                <Option value="my">Мои клиенты</Option>
                                <Option value="without">Клиенты без тренера</Option>
                            </Select>

                            <Button onClick={handleClearFilters}>Сбросить всё</Button>
                        </Space>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 8,
                            }}
                        >
                            <Typography.Text type="secondary">
                                Найдено: {filteredClients.length} клиентов
                            </Typography.Text>

                            <div style={{ display: 'flex', gap: 8 }}>
                                <Typography.Text type="secondary">
                                    Фильтр:{' '}
                                    {filterType === 'all'
                                        ? 'Все клиенты'
                                        : filterType === 'my'
                                          ? 'Мои клиенты'
                                          : 'Клиенты без тренера'}
                                </Typography.Text>
                                {searchText && (
                                    <Typography.Text type="secondary">
                                        | Поиск: "{searchText}"
                                    </Typography.Text>
                                )}
                            </div>
                        </div>
                    </Space>
                </Card>
            )}

            {/* Список клиентов */}
            {filteredClients.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '40px' }}>
                    <Alert
                        message="Клиенты не найдены"
                        description={
                            searchText || filterType !== 'all'
                                ? 'Попробуйте изменить условия поиска или фильтрации'
                                : 'В системе пока нет клиентов'
                        }
                        type="info"
                        showIcon
                    />
                    {(searchText || filterType !== 'all') && (
                        <Button onClick={handleClearFilters} style={{ marginTop: 16 }}>
                            Сбросить фильтры
                        </Button>
                    )}
                </Card>
            ) : (
                <Row gutter={[16, 16]}>
                    {filteredClients.map((client) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={client.id}>
                            <ClientCard user={user} client={client} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};
