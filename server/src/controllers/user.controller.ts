import { Request, Response } from 'express';
import { AppDataSource } from '../config/database.config.js';
import { User } from '../entities/user.entity.js';

const userRepository = AppDataSource.getRepository(User);

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}

// GET /api/users - Get all users
export const getAllUsers = async (req: Request, res: Response<ApiResponse<User[]>>) => {
    try {
        const users = await userRepository.find();
        res.json({ data: users, error: null });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
        res.json({ data: null, error: errorMessage });
    }
};

// GET /api/users/:id - Get user by ID
export const getUserById = async (req: Request, res: Response<ApiResponse<User>>) => {
    try {
        const { id } = req.params;
        const user = await userRepository.findOne({ where: { id } });

        if (!user) {
            return res.json({ data: null, error: 'User not found' });
        }

        res.json({ data: user, error: null });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
        res.json({ data: null, error: errorMessage });
    }
};

// POST /api/users - Create user
export const createUser = async (req: Request, res: Response<ApiResponse<User>>) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        const user = userRepository.create({
            email,
            password,
            firstName,
            lastName,
            isActive: true,
        });

        await userRepository.save(user);
        res.status(201).json({ data: user, error: null });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
        res.json({ data: null, error: errorMessage });
    }
};

// PUT /api/users/:id - Update user
export const updateUser = async (req: Request, res: Response<ApiResponse<User>>) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        await userRepository.update(id, updates);
        const updatedUser = await userRepository.findOne({ where: { id } });

        if (!updatedUser) {
            return res.json({ data: null, error: 'User not found' });
        }

        res.json({ data: updatedUser, error: null });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
        res.json({ data: null, error: errorMessage });
    }
};

// DELETE /api/users/:id - Delete user
export const deleteUser = async (req: Request, res: Response<ApiResponse<null>>) => {
    try {
        const { id } = req.params;
        const user = await userRepository.findOne({ where: { id } });

        if (!user) {
            return res.json({ data: null, error: 'User not found' });
        }

        await userRepository.delete(id);
        res.json({ data: null, error: null });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
        res.json({ data: null, error: errorMessage });
    }
};
