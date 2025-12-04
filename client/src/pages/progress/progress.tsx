import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';

import {
    DatePicker,
    Checkbox,
    Pagination,
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
import { ProgressWidget } from '@/widgets/progress/progress';

import { CommentsList } from './ui/comments';

import { PARAMS } from '@shared/contants/params';

import { ProgressReport, ParamKey } from '@/shared/stores/user/progress/progress-types';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

type ModalType = 'month' | 'year' | 'week' | 'range' | null;

export const ProgressPage = () => {
    const { reports, filters, setFilters, resetDateFilters, setPage } =
        useProgressStore();

    const withinRange = useMemo(() => {
        return (r: ProgressReport) => {
            const date = dayjs(r.date, 'DD/MM/YYYY');
            const from = filters.fromDate;
            const to = filters.toDate;
            if (from && date.isBefore(from, 'day')) return false;
            if (to && date.isAfter(to, 'day')) return false;
            return true;
        };
    }, [filters.fromDate, filters.toDate]);

    const filteredReports = useMemo(
        () => reports.filter(withinRange),
        [reports, withinRange]
    );

    const activeParams = useMemo(() => {
        return PARAMS.map((p) => p.key).filter((k) => filters.showParams[k]);
    }, [filters.showParams]);

    const chartData = useMemo(() => {
        return filteredReports.map((r: ProgressReport) => {
            const entry: { date: string } & Partial<Record<ParamKey, number>> = {
                date: r.date,
            };
            activeParams.forEach((param) => {
                entry[param] = r[param];
            });
            return entry;
        });
    }, [filteredReports, activeParams]);

    const paginatedReports = useMemo(() => {
        const start = (filters.page - 1) * filters.pageSize;
        return filteredReports.slice(start, start + filters.pageSize);
    }, [filteredReports, filters.page, filters.pageSize]);

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
            page: 1,
        });
    };

    const rangeValue: [Dayjs | null, Dayjs | null] = [
        filters.fromDate ? dayjs(filters.fromDate) : null,
        filters.toDate ? dayjs(filters.toDate) : null,
    ];
    const onPageChange = (page: number) => {
        setPage(page);
    };

    const [openModalType, setOpenModalType] = useState<ModalType>(null);

    const showModal = (type: ModalType) => {
        setOpenModalType(type);
    };

    const closeModal = () => {
        setOpenModalType(null);
    };

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
                        <NavLink to="new-report">
                            <Flex gap={10}>
                                <PlusSquareOutlined />
                                <Text>Добавить прогресс</Text>
                            </Flex>
                        </NavLink>
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
            <CommentsList data={paginatedReports} />
            <Row justify="end" style={{ marginTop: 16 }}>
                <Pagination
                    current={filters.page}
                    pageSize={filters.pageSize}
                    onChange={onPageChange}
                    showSizeChanger={false}
                />
            </Row>
        </section>
    );
};
