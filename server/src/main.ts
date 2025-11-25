import 'reflect-metadata';
import { createApp } from './app.js';
import { AppDataSource } from '@/database/database.config.js';

const PORT = process.env.PORT || 3000;
const app = createApp();

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
