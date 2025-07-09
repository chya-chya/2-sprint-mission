import { Strategy as JwtStrategy } from 'passport-jwt';
import prisma from '../utills/prisma';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

const accessTokenOptions = {
  jwtFromRequest: (req: express.Request) => req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME as string],
  secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET as string,
};

const refreshTokenOptions = {
  jwtFromRequest: (req: express.Request) => req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string],
  secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET as string,
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });
    done(null, user);
  } catch (error) {
    done(error, false);
  }
}

export const accessTokenStrategy = new JwtStrategy(
  accessTokenOptions,
  jwtVerify
);

export const refreshTokenStrategy = new JwtStrategy(
  refreshTokenOptions,
  jwtVerify
);
