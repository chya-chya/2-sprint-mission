import express from 'express';
import prisma from '../../utills/prisma.js';
import bcrypt from 'bcrypt';

class userService {
  static getUser: express.RequestHandler = async(req, res, next) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user!.id}});
      if (!user) {
        const err = new Error('user를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      const { password, ...rest } = user;
      res.send(rest);
    } catch(err) {
      next(err);
    }
  }

  static updateUser: express.RequestHandler = async(req, res, next) => {
    try {
      if (req.body.password) {
        return next(new Error('비밀번호는 변경할 수 없습니다.'));
      }
      const user = await prisma.user.findUnique({ where: { id: req.user!.id}});
      if (!user) {
        const err = new Error('user를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      const updatedUser = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          email: req.body.email,
          nickname: req.body.nickname,
        },
      });
      const { password, ...rest} = updatedUser;
      res.send(updatedUser);
    } catch(err) {
      next(err);
    }
  }

  static updatePassword: express.RequestHandler = async(req, res, next) => {
    try {
      const newHashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      const user = await prisma.user.findUnique({ where: { id: req.user!.id}});
      if (!user) {
        const err = new Error('user를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return next(new Error('현재 비밀번호가 일치하지 않습니다.'));
      }
      await prisma.user.update({
        where: { id: req.user!.id},
        data: { password: newHashedPassword },
      });
      res.send({ message: '비밀번호 변경 성공' });
    } catch(err) {
      next(err);
    }
  }

  static getUserProducts: express.RequestHandler = async(req, res, next) => {
    try {
      const products = await prisma.product.findMany({ where: { userId: req.user!.id}});
      res.send(products);
    } catch(err) {
      next(err);
    }
  }

  static getUserArticles: express.RequestHandler = async(req, res, next) => {
    try {
      const articles = await prisma.article.findMany({ where: { userId: req.user!.id}});
      res.send(articles);
    } catch(err) {
      next(err);
    }
  }
}

export default UserService;