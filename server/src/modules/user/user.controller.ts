import { Request, Response } from 'express';
import { userService } from './user.service.js';
import { createApiResponse } from '@utils/api-response.js';

export const userController = {
    async getAllUsers(req: Request, res: Response) {
        const users = await userService.findAll();
        res.status(200).json(createApiResponse(users));
    },

    async getUserById(req: Request, res: Response) {
        const user = await userService.findOne(req.params.id);
        if (!user) {
            return res.status(404).json(createApiResponse(null, 'User not found'));
        }
        res.status(200).json(createApiResponse(user));
    },

    async createUser(req: Request, res: Response) {
        const user = await userService.create(req.body);
        res.status(201).json(createApiResponse(user));
    },

    async updateUser(req: Request, res: Response) {
        const updatedUser = await userService.update(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json(createApiResponse(null, 'User not found'));
        }
        res.status(200).json(createApiResponse(updatedUser));
    },

    async deleteUser(req: Request, res: Response) {
        const user = await userService.findOne(req.params.id);
        if (!user) {
            return res.status(404).json(createApiResponse(null, 'User not found'));
        }
        await userService.delete(req.params.id);
        res.status(200).json(createApiResponse(null));
    },
};
