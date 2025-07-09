import express from 'express';
import prisma from '../../utills/prisma.js';
import passport from '../../lib/passport/index.js';
import bcrypt from 'bcrypt';
import authService from '../service/user/auth-service.js';
import userService from '../service/user/user-service.js';

const userController = express.Router();

userController.post('/register', authService.register);
userController.post('/login', authService.login);
userController.post('/logout', authService.logout);
userController.get('/', userService.getUser);
userController.patch('/', userService.updateUser);
userController.patch('/password', userService.updatePassword);
userController.get('/products', userService.getUserProducts);
userController.get('/articles', userService.getUserArticles);

export default userController;