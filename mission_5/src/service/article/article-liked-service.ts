import express from 'express';
import prisma from '../../utills/prisma';

class ArticleLikedService {

  static getArticleLiked: express.RequestHandler = async (req, res, next) => {
    try {
      const articleLiked = await prisma.articleLiked.findMany({
        where: {
          userId: Number(req.user!.id),
        },
      });
      res.send(articleLiked);
    } catch(err) {
      next(err);
    } 
  }
    
  static createArticleLiked: express.RequestHandler = async (req, res, next) => {
    try {
      const articleLiked = await prisma.articleLiked.findUnique({
        where: {
          userId_articleId: {
            userId: Number(req.user!.id),
            articleId: Number(req.params.articleId),
          },
        },
      });
      if (articleLiked) {
        return next(new Error('이미 좋아요를 눌렀습니다.'));
      }
      await prisma.articleLiked.create({
        data: {
          userId: Number(req.user!.id),
          articleId: Number(req.params.articleId),
        },
      });
      res.send({ message: '좋아요를 눌렀습니다.' });
    } catch(err) {
      next(err);
    }
  }

  static deleteArticleLiked: express.RequestHandler = async (req, res, next) => {
    try {
      const articleLiked = await prisma.articleLiked.findUnique({
        where: {
          userId_articleId: {
            userId: Number(req.user!.id),
            articleId: Number(req.params.articleId),
          },
        },
      });
      if (!articleLiked) {
        return next(new Error('좋아요를 찾을 수 없습니다.'));
      }
      await prisma.articleLiked.delete({
        where: {
          userId_articleId: {
            userId: Number(req.user!.id),
            articleId: Number(req.params.articleId),
          },
        },
      });
      res.send({ message: '좋아요를 취소했습니다.' });
    } catch(err) {
      next(err);
    }
  }
}

export default ArticleLikedService;