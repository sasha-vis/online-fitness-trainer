import {
    Tooltip,
    XAxis,
    YAxis,
    Legend,
    Bar,
    BarChart,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

import { ParamKey } from '@/shared/stores/user/progress/progress-types';

export const ProgressWidget = ({
    data,
    params,
}: {
    data: ({
        date: string;
    } & Partial<Record<ParamKey, number>>)[];
    params: ParamKey[];
}) => {
    const PARAMS_META = {
        weight: { label: 'Вес', color: '#8884d8' },
        waist: { label: 'Талия', color: '#82ca9d' },
        hips: { label: 'Бёдра', color: '#ffc658' },
        chest: { label: 'Грудь', color: '#ff7300' },
        arms: { label: 'Руки', color: '#0088fe' },
        legs: { label: 'Ноги', color: '#00c49f' },
    };

    return (
        <div>
            <ResponsiveContainer width={400} height={300}>
                <BarChart
                    style={{
                        width: '100%',
                        maxWidth: '700px',
                        maxHeight: '70vh',
                        aspectRatio: 1.618,
                    }}
                    responsive
                    data={data}
                    margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis width="auto" />
                    <Tooltip />
                    <Legend />
                    {params.map((param) => (
                        <Bar
                            key={param}
                            dataKey={param}
                            name={PARAMS_META[param]?.label || param}
                            fill={PARAMS_META[param]?.color || '#8884d8'}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
