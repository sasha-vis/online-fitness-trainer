import express from 'express';
import userRoutes from './user.routes.js';

const router = express.Router({ mergeParams: true });

router.use('/users', userRoutes);

export default router;
