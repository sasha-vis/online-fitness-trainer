import { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
    token: {
        colorPrimary: '#1890ff',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#f5222d',
        fontSize: 14,
        borderRadius: 6,
        fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    components: {
        Button: {
            colorPrimary: '#1890ff',
            algorithm: true,
        },
        Card: {
            borderRadiusLG: 8,
            paddingLG: 24,
        },
        Input: {
            colorBorder: '#d9d9d9',
            controlHeight: 32,
        },
        Modal: {
            paddingXS: 16,
            paddingSM: 24,
        },
    },
};
