import { useMemo, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';

import {
    DatePicker,
    Checkbox,
    message,
    Typography,
    Row,
    Col,
    Button,
    Flex,
    Modal,
} from 'antd';
import {
    ReloadOutlined,
    OrderedListOutlined,
    PlusSquareOutlined,
} from '@ant-design/icons';

import { useProgressStore } from '@shared/stores/user/progress/progress';
import { useAuthStore } from '@shared/stores/user/user';
import { ProgressWidget } from '@/widgets/progress/progress';
import { BodyMeasurementModal } from './body-measurements-modal';
import { BodyMeasurement } from '@shared/stores/user/progress/progress-types';

import { PARAMS } from '@shared/contants/params';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

type ModalType = 'month' | 'year' | 'week' | 'range' | null;

export const Progress = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const { user } = useAuthStore();
    const {
        measurements,
        loading,
        add,
        update,
        subscribe,
        filters,
        setFilters,
        resetDateFilters,
    } = useProgressStore();

    useEffect(() => {
        if (user?.id) subscribe(user.id);
    }, [user, subscribe]);

    const activeParams = useMemo(() => {
        return PARAMS.map((p) => p.key).filter((k) => filters.showParams[k]);
    }, [filters.showParams]);

    const onDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (!dates) {
            setFilters({ fromDate: null, toDate: null });
            return;
        }
        const [fromDate, toDate] = dates;
        setFilters({
            fromDate: fromDate ? fromDate.format('YYYY-MM-DD') : null,
            toDate: toDate ? toDate.format('YYYY-MM-DD') : null,
        });
    };

    const onParamChange = (param: keyof typeof filters.showParams, checked: boolean) => {
        setFilters({
            showParams: {
                ...filters.showParams,
                [param]: checked,
            },
        });
    };

    const rangeValue: [Dayjs | null, Dayjs | null] = [
        filters.fromDate ? dayjs(filters.fromDate) : null,
        filters.toDate ? dayjs(filters.toDate) : null,
    ];
    const [openModalType, setOpenModalType] = useState<ModalType>(null);

    const showModal = (type: ModalType) => {
        setOpenModalType(type);
    };

    const closeModal = () => {
        setOpenModalType(null);
    };

    const handleModalSubmit = async (
        values: Omit<BodyMeasurement, 'id' | 'clientId' | 'createdAt' | 'updatedAt'>
    ) => {
        if (!user?.id) {
            message.error('Пользователь не авторизован');
            return;
        }
        if (editRecord?.id) {
            await update(editRecord.id, values);
        } else {
            await add({
                ...values,
                clientId: user.id,
            });
        }
    };

    const chartData = useMemo(
        () =>
            measurements.map((m) => ({
                date: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '',
                arm: m.arm,
                chest: m.chest,
                hips: m.hips,
                leg: m.leg,
                waist: m.waist,
                weight: m.weight,
            })),
        [measurements]
    );

    return (
        <section style={{ padding: 24 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Title level={3}>
                        Ваш Прогресс за
                        <Button type="text" onClick={() => showModal('month')}>
                            месяц
                        </Button>
                        <Button type="text" onClick={() => showModal('year')}>
                            год
                        </Button>
                        <Button type="text" onClick={() => showModal('week')}>
                            неделя
                        </Button>
                        <Button type="text" onClick={() => showModal('range')}>
                            выбрать интервал
                        </Button>
                    </Title>
                </Col>
            </Row>
            <Modal
                title={openModalType ? openModalType : ''}
                open={!!openModalType}
                onOk={closeModal}
                onCancel={closeModal}
            >
                <RangePicker
                    value={rangeValue}
                    onChange={onDateRangeChange}
                    picker={
                        openModalType === 'range' || openModalType == null
                            ? undefined
                            : (openModalType as 'month' | 'year' | 'week')
                    }
                />
            </Modal>
            <Flex justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Flex vertical justify="space-between" align="space-between" gap={30}>
                    <Flex vertical>
                        {PARAMS.map((param) => (
                            <Checkbox
                                key={param.key}
                                checked={!!filters.showParams[param.key]}
                                onChange={(e) =>
                                    onParamChange(param.key, e.target.checked)
                                }
                            >
                                {param.label}
                            </Checkbox>
                        ))}
                    </Flex>
                    <Flex vertical>
                        <Flex gap={10} style={{ cursor: 'pointer', color: '#1677ff' }}>
                            <PlusSquareOutlined />
                            <Text onClick={() => setModalOpen(true)}>
                                Добавить прогресс
                            </Text>
                        </Flex>
                        <NavLink to="reports">
                            <Flex gap={10}>
                                <OrderedListOutlined />
                                <Text>Все отчеты</Text>
                            </Flex>
                        </NavLink>
                    </Flex>
                </Flex>
                <Flex flex="1" justify="center">
                    <ProgressWidget data={chartData} params={activeParams} />
                </Flex>
            </Flex>

            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col flex="auto" style={{ textAlign: 'right' }}>
                    <Button
                        onClick={resetDateFilters}
                        icon={<ReloadOutlined />}
                        disabled={!activeParams}
                    >
                        Сбросить фильтры
                    </Button>
                </Col>
            </Row>
            <BodyMeasurementModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditRecord(null);
                }}
                onSubmit={handleModalSubmit}
                loading={loading}
                initialValues={editRecord || undefined}
            />
        </section>
    );
};
