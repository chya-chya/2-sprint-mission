import express from 'express';
import prisma from '../../utills/prisma';

class ProductLikedService {

  static getProductLiked: express.RequestHandler = async (req, res, next) => {
    try {
      const productLiked = await prisma.productLiked.findMany({
        where: {
          userId: Number(req.user!.id),
        },
      });
      res.send(productLiked);
    } catch(err) {
      next(err);
    } 
  }

  static createProductLiked: express.RequestHandler = async (req, res, next) => {
    try {
      const productLiked = await prisma.productLiked.findUnique({
        where: {
          userId_productId: {
            userId: Number(req.user!.id),
            productId: Number(req.params.productId),
          },
        },
      });
      if (productLiked) {
        return next(new Error('이미 좋아요를 눌렀습니다.'));
      }
      await prisma.productLiked.create({
        data: {
          userId: Number(req.user!.id),
          productId: Number(req.params.productId),
        },
      });
      res.send({ message: '좋아요를 눌렀습니다.' });
    } catch (err) {
      next(err);
    }
  }

  static deleteProductLiked: express.RequestHandler = async (req, res, next) => {
    try {
      const productLiked = await prisma.productLiked.findUnique({
        where: {
          userId_productId: {
            userId: Number(req.user!.id),
            productId: Number(req.params.productId),
          },
        },
      });
      if (!productLiked) {
        return next(new Error('좋아요를 찾을 수 없습니다.'));
      }
      await prisma.productLiked.delete({
        where: {
          userId_productId: {
            userId: Number(req.user!.id),
            productId: Number(req.params.productId),
          },
        },
      });
      res.send({ message: '좋아요를 취소했습니다.' });
    } catch (err) {
      next(err);
    }
  }
}

export default ProductLikedService;