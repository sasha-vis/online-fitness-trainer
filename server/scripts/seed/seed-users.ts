import { AppDataSource } from '../../src/database/database.config.js';
import { User } from '../../src/modules/user/user.entity.js';
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);

const testUsers = [
    {
        email: 'user1@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
    },
    {
        email: 'user2@example.com',
        password: 'Password123',
        firstName: 'Jane',
        lastName: 'Smith',
    },
    {
        email: 'trainer@example.com',
        password: 'Trainer123',
        firstName: 'Mike',
        lastName: 'Johnson',
    },
    {
        email: 'client@example.com',
        password: 'Client123',
        firstName: 'Sarah',
        lastName: 'Wilson',
    },
    {
        email: 'admin@example.com',
        password: 'Admin123',
        firstName: 'Admin',
        lastName: 'User',
    },
];

async function seedUsers() {
    try {
        await AppDataSource.initialize();
        console.log('📦 Database connected');

        await userRepository.clear();
        console.log('🧹 Users table cleared');

        for (const userData of testUsers) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const user = userRepository.create({
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName,
                lastName: userData.lastName,
                isActive: true,
            });

            await userRepository.save(user);
            console.log(`✅ Created user: ${user.email}`);
        }

        console.log('🎉 Test users created successfully!');
        console.log('👥 Total users:', testUsers.length);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    }
}

seedUsers();
