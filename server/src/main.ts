import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import routes from './routes/index.js';
import { AppDataSource } from './config/database.config.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
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

AppDataSource.initialize()
    .then(() => {
        console.log('📦 Database connected successfully');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🔗 Local: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    });

export default app;
