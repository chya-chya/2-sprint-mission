import express from 'express';
import prisma from '../../src/utills/prisma';
import passport from '../../src/passport/index';
import bcrypt from 'bcrypt';

const userRouter = express.Router();

interface UpdateUserBody {
  email?: string;
  nickname?: string;
}

interface UpdatePasswordBody {
  password: string;
  newPassword: string;
}

userRouter.get('/',
  passport.authenticate('access-token', { session: false }),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id}});
      if (!user) {
        const err = new Error('user를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      delete user.password;
      res.send(user);
    } catch(err) {
      next(err);
    }
  }
);

userRouter.patch('/',
  passport.authenticate('access-token', { session: false }),
  async (req: express.Request<{}, {}, UpdateUserBody>, res: express.Response, next: express.NextFunction) => {
    try {
      if (req.body.password) {
        return next(new Error('비밀번호는 변경할 수 없습니다.'));
      }
      const user = await prisma.user.findUnique({ where: { id: req.user.id}});
      if (!user) {
        const err = new Error('user를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          email: req.body.email,
          nickname: req.body.nickname,
        },
      });
      delete updatedUser.password;
      res.send(updatedUser);
    } catch(err) {
      next(err);
    }
  }
);

userRouter.patch('/password',
  passport.authenticate('access-token', { session: false }),
  async (req: express.Request<{}, {}, UpdatePasswordBody>, res: express.Response, next: express.NextFunction) => {
    try {
      const newHashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      const user = await prisma.user.findUnique({ where: { id: req.user.id}});
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
        where: { id: req.user.id},
        data: { password: newHashedPassword },
      });
      res.send({ message: '비밀번호 변경 성공' });
    } catch(err) {
      next(err);
    }
  }
);

userRouter.get('/products',
  passport.authenticate('access-token', { session: false }),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const products = await prisma.product.findMany({ where: { userId: req.user.id}});
      res.send(products);
    } catch(err) {
      next(err);
    }
  }
);

userRouter.get('/articles',
  passport.authenticate('access-token', { session: false }),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const articles = await prisma.article.findMany({ where: { userId: req.user.id}});
      res.send(articles);
    } catch(err) {
      next(err);
    }
  }
);

export default userRouter;
