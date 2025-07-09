import passport from '../passport/index';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();


export const optionalAuth: express.RequestHandler = (req, res, next) => {
  if(req.headers.cookie && req.headers.cookie.includes(process.env.ACCESS_TOKEN_COOKIE_NAME as string)) {
    passport.authenticate('access-token', { session: false, failWithError: true }, (err, user, info) => {
      if (err) { // 토큰 인증 에러시에도 진행
        return next();
      if (user) { // 토큰 인증 성공시 진행
        req.user = user;
      }
      next();
    })(req, res, next);
  } else { // 토큰이 없으면 진행
    next(); 
  }
};
