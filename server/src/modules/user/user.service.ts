import { AppDataSource } from '@/database/database.config.js';
import { User } from './user.entity.js';

const userRepository = AppDataSource.getRepository(User);

export const userService = {
    async findAll() {
        return await userRepository.find();
    },

    async findOne(id: string) {
        return await userRepository.findOne({ where: { id } });
    },

    async create(userData: Partial<User>) {
        const user = userRepository.create(userData);
        return await userRepository.save(user);
    },

    async update(id: string, updates: Partial<User>) {
        await userRepository.update(id, updates);
        return await this.findOne(id);
    },

    async delete(id: string) {
        return await userRepository.delete(id);
    },
};
