import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '@modules/user/user.entity.js';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: true,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    entities: [User],
    migrations: [],
    subscribers: [],
});
