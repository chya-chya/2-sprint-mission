import express from 'express';
import prisma from '../../utills/prisma';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../../utills/structs';

class ProductService {
  
  static getProducts: express.RequestHandler = async (req, res, next) => {
    const { offset = 0, limit = 10, sort = 'recent', search = ''} = req.query as {
      offset: string | number;
      limit: string | number;
      sort: string;
      search: string;
    };
    let orderBy: { createdAt: 'asc' | 'desc' };
    switch(sort) {
      case 'recent':
        orderBy = { createdAt: 'desc' };
        break;
      case 'former':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc'};
    }
    const product = await prisma.product.findMany({
      orderBy,
      skip: Number(offset),
      take: Number(limit),
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' }},
          { description: { contains: search, mode: 'insensitive' }},
        ],
      },
      select: {
        id: true,
        name: true, 
        description: false,
        price: true,
        tags: false,
        createdAt: true,
        updatedAt: false,
        productLiked: true,
      },
    });
    if (product.length === 0) {
      res.status(200).json({ message: `${search}로 검색된 게시글이 없습니다. (offset: ${offset})` });
      return;
    }
    
    const response = product.map((product) => {
      let isLiked = false;
      if (req.user) {
        isLiked = product.productLiked.some((liked) => liked.userId === req.user?.id) ?? false;
      }
      const { productLiked, ...rest } = product;
      const productData = {
        ...rest,
        isLiked: isLiked
      };
      return productData;
    });
    
    res.status(200).json(response);
  }

  static createProduct: express.RequestHandler = async (req, res, next) => {
    try {
      assert(req.body, CreateProduct);
      const product = await prisma.product.create({
        data: {
          ...req.body,
          userId: req.user!.id
        },
      });
      res.send(product);
    } catch (err) {
      return next(err);
    }
  }

  static getProductById: express.RequestHandler = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id: id },
      select: {
      id: true,
      name: true, 
      description: true,
      price: true,
      tags: true,
      createdAt: true,
      updatedAt: false,
      productLiked: true,
      },
    });
    if (!product) {
      const err = new Error('product를 찾을 수 없습니다.');
      err.status = 404;
      return next(err);
    }
    let isLiked = false;
    if (req.user) {
      isLiked = product.productLiked.some((liked) => liked.userId === req.user?.id) ?? false;
    }
    const { productLiked, ...rest } = product;
    const response = {
      ...rest,
      isLiked: isLiked,
    }
    res.json(response);
  }


  static updateProduct: express.RequestHandler = async (req, res, next) => {
      try {
        assert(req.body, PatchProduct);
        const id = Number(req.params.id);
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
          const err = new Error('product를 찾을 수 없습니다.');
          err.status = 404;
          return next(err);
        }
        if (product.userId !== req.user!.id) {
          const err = new Error('인증되지 않은 사용자입니다.');
          err.status = 401;
          return next(err);
        }
        const updatedProduct = await prisma.product.update({
          where: { id: id },
          data: req.body,
        });
        res.send(updatedProduct);
      } catch (err) {
        return next(err);
      }
  }


  static deleteProduct: express.RequestHandler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        const err = new Error('product를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      if (product.userId !== req.user!.id) {
        const err = new Error('인증되지 않은 사용자입니다.');
        err.status = 401;
        return next(err);
      }
      await prisma.product.delete({
        where: { id: id },
      });
      res.sendStatus(204);
    } catch (err) {
      if ((err as Error).code === 'P2025') { // Prisma의 RecordNotFound 에러
        const error = new Error('ID를 찾을 수 없습니다.');
        error.status = 404;
        return next(error);
      }
      next(err);
    }
  }
}

export default ProductService;