import express from 'express';
import prisma from '../../src/utills/prisma';
import bcrypt from 'bcrypt';
import { isEmail } from 'is-email';
import passport from '../../src/passport/index';
import { generateTokens } from '../../src/utills/token';
import dotenv from 'dotenv';
import { loginLimiter } from '../../src/utills/loginLimiter';

dotenv.config();

const authRouter = express.Router();

interface RegisterBody {
  email: string;
  nickname: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

authRouter.post('/register', async (req: express.Request<{}, {}, RegisterBody>, res: express.Response, next: express.NextFunction) => {
  try {
    const { email, nickname, password } = req.body;
    if (!isEmail(email)) {
      return res.status(400).send('이메일 형식이 올바르지 않습니다.');
    }
    if (!password) {
      return res.status(400).send('비밀번호가 필요합니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },  
    });
    delete user.password;
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    next(err);
  }
});

authRouter.delete('/unregister', 
  passport.authenticate('access-token', { session: false }),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id}});
      if (!user) {
        const err = new Error('user를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return next(new Error('비밀번호가 일치하지 않습니다.'));
      }
      await prisma.user.delete({
        where: { id: req.user.id },
      });
      res.send({ message: 'user가 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.post('/login',
  loginLimiter,
  passport.authenticate('local', { session: false }),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { accessToken, refreshToken } = generateTokens(req.user.id);
      setTokenCookies(res, accessToken, refreshToken);
      res.status(200).json({ message: '로그인 성공' });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.post('/refresh',
  passport.authenticate('refresh-token', { session: false }),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { accessToken, refreshToken } = generateTokens(req.user.id);
      setTokenCookies(res, accessToken, refreshToken);
      res.status(200).json({ message: 'refresh token 성공' });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.post('/logout', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    res.clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME);
    res.status(200).json({ message: '로그아웃 성공' });
  } catch (err) {
    next(err);
  }
});

export default authRouter;
