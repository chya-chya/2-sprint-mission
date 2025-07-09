import prisma from '../src/utills/prisma';


declare module '@prisma/client' {
  interface Article {
    isLiked?: boolean;
  }
}