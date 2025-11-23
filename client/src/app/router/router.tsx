import { Route, Routes } from 'react-router-dom';
import { Home } from '@/pages/home/home';

export const Router = () => {
    return (
        <>
            <Routes>
                <Route index element={<Home />} />
            </Routes>
        </>
    );
};
