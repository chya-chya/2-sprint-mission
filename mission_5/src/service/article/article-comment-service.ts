import express from 'express';
import prisma from '../../utills/prisma';
import { Prisma } from '@prisma/client';

class articleCommentService {
  static getArticleComments: express.RequestHandler = async (req, res, next) => {
    let cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const findManyArgs: Prisma.ArticleCommentFindManyArgs = {
      take: 3,
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true, 
        content: true,
        createdAt: true,
      },
    };
    if (cursor) {
      findManyArgs.cursor = { id: cursor };
      findManyArgs.skip = 1;
    }
    const comments = await prisma.articleComment.findMany(findManyArgs);
    let message
    if(comments[2]) {
      message = `다음 커서는 ${comments[2].id}입니다.`;
    } else {
      message = '다음 커서가 없습니다.';
    }
    res.send({commnts: comments, message: message});
  }

  static createArticleComment: express.RequestHandler = async (req, res, next) => {
    const Comment = await prisma.articleComment.create({
      data: {
        ...req.body,
        userId: req.user!.id,
        articleId: Number(req.params.articleId),
      },
    });
    res.send(Comment);
  }

  static updateArticleComment: express.RequestHandler = async (req, res, next) => {
    try {
      const id = parseInt(req.params.articleId);
      const comment = await prisma.articleComment.findUnique({ where: { id: id } });
      if (!comment) {
        const err = new Error('comment를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      if (comment.userId !== req.user!.id) {
        const err = new Error('인증되지 않은 사용자입니다.');
        err.status = 401;
        return next(err);
      }
      const updatedComment = await prisma.articleComment.update({
        where: { id: id },
        data: req.body,
      });
      res.send(updatedComment);
    } catch (err) {
      if (err.code === 'P2025') {
        const error = new Error('ID not found');
        error.status = 404;
        return next(error);
      }
      next(err);
    }
  }

  async function deleteArticleComment(req, res, next) {
    try {
      const id = parseInt(req.params.articleId);
      const comment = await prisma.articleComment.findUnique({ where: { id: id } });
      if (!comment) {
        const err = new Error('comment를 찾을 수 없습니다.');
        err.status = 404;
        return next(err);
      }
      if (comment.userId !== req.user.id) {
        const err = new Error('인증되지 않은 사용자입니다.');
        err.status = 401;
        return next(err);
      }
      await prisma.articleComment.delete({
        where: { id : id },
      });
      res.sendStatus(204);
    } catch (err) {
      if (err.code === 'P2025') {
        const error = new Error('ID not found');
        error.status = 404;
        return next(error);
      }
      next(err);
    }
  }
}

export default articleCommentSrvice;