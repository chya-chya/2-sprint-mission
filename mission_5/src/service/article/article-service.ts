import express from 'express';
import { assert } from 'superstruct';
import prisma from '../../utills/prisma';
import { Article } from '@prisma/client';
import { 
  CreateArticle,
  PatchArticle 
} from '../../../structs';

class ArticleService {

  static getArticles: express.RequestHandler = async (req, res, next) => {
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
        orderBy = { createdAt: 'desc' };
    }
    const articles = await prisma.article.findMany({
      orderBy,
      skip: Number(offset),
      take: Number(limit),
      where: {
        OR: [
          { title: { contains: search, mode: 'insensitive' }},
          { content: { contains: search, mode: 'insensitive' }},
        ],
      },
      select: {
      id: true,
      title: true,   
      content: true,
      createdAt: true,
      updatedAt: true, 
      userId: true,    
      articleLiked: true,
      },
    });
    if (articles.length === 0) {
        res.send({ message : `${search}로 검색된 게시글이 없습니다. (offset: ${offset})`});
        return;
    }
    const response = articles.map((article) => {
      let isLiked = false;
      if (req.user) {
        isLiked = article.articleLiked?.some((liked) => liked.userId === req.user?.id) ?? false;
      }
      const { articleLiked, ...rest } = article;
      const articlsData: Article & { isLiked: boolean } = {
        ...rest,
        isLiked: isLiked
      };
      return articlsData;
    });
    res.send(response);
  }

  static createArticle: express.RequestHandler = async (req, res, next) => {
    try {
      assert(req.body, CreateArticle);
      const article = await prisma.article.create({
        data: {
          ...req.body,
          userId: req.user!.id,
        },
      });
      res.send(article);
    } catch (err) {
        return next(err);
    }
  }

  static getArticleById: express.RequestHandler = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const article = await prisma.article.findUnique({
      where: { id: id },
      select: {
      id: true,     
      title: true,   
      content: true,
      createdAt: true,
      updatedAt: false,
      userId: false,
      articleLiked: true,
      },
    });
    if (!article) {
      const err = new Error('article을 찾을 수 없습니다.');
      err.status = 404;
      return next(err);
    }
    let isLiked = false;
    if (req.user) {
      isLiked = article.articleLiked?.some((liked) => liked.userId === req.user?.id) ?? false;
    }
    const { articleLiked, ...rest } = article;
    const response = {
      ...rest,
      isLiked: isLiked,
    }
    res.send(response);
  }

  static updateArticle: express.RequestHandler = async (req, res, next) => {
    try {
      assert(req.body, PatchArticle);
      const id = Number(req.params.id);
      const article = await prisma.article.findUnique({ where: { id: id } });
      if (!article) {
        const err = new Error('article을 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      if (article.userId !== req.user?.id) {
        const err = new Error('인증되지 않은 사용자입니다.');
        err.status = 401;
        return next(err);
      }
      const updatedArticle = await prisma.article.update({
        where: { id: id },
        data: req.body,
      });
      res.send(updatedArticle);
    } catch (err) {
      return next(err);
    }
  }

  static deleteArticle: express.RequestHandler  = async (req, res, next) => {
    try {
    const id = Number(req.params.id);
    const article = await prisma.article.findUnique({ where: { id: id } });
    if (!article) {
      const err = new Error('article을 찾을 수 없습니다.');
      err.status = 404;
      return next(err);
    }
    if (article.userId !== req.user!.id) {
      const err = new Error('인증되지 않은 사용자입니다.');
      err.status = 401;
      return next(err);
    }
    await prisma.article.delete({
      where: { id },
    });
      res.sendStatus(204);
    } catch (err) {
      if ((err as Error).code === 'P2025') { // Prisma의 RecordNotFound 에러
        const error = new Error('article을 찾을 수 없습니다.');
        error.status = 404;      return next(error);
      }
      next(err);
    }
  }
}

export default ArticleService;