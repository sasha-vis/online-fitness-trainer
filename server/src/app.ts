import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import routes from '@/routes/index.js';
import { errorMiddleware } from '@middleware/error.middleware.js';

dotenv.config();

export const createApp = () => {
    const app = express();

    app.use(cookieParser());
    app.use(express.json());
    app.use('/api', routes);

    if (process.env.NODE_ENV === 'production') {
        const publicPath = path.join(process.cwd(), 'public');
        const indexFile = path.join(publicPath, 'index.html');

        app.use(express.static(publicPath));
        app.get(/(.*)/, (req, res) => {
            res.sendFile(indexFile);
        });
    }

    app.use(errorMiddleware);

    return app;
};
