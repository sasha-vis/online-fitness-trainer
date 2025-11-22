import ruRU from 'antd/locale/ru_RU';
import { ConfigProvider } from 'antd';
import { FC, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { antdTheme } from '../styles/antd-theme';

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <BrowserRouter>
            <ConfigProvider
                locale={ruRU}
                theme={antdTheme}
            >
                {children}
            </ConfigProvider>
        </BrowserRouter>
    )
}