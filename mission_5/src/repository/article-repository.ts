import prisma from "../utills/prisma";
import { Prisma } from '@prisma/client';

class ArticleRepository {
  static getArticles = async () => {
    try {
      const articles = await prisma.article.findMany();
      return articles;
    } catch(err) {
      return err;
    }
  }

  static getArticleByIdOrThrow = async (id: number) => {
    try {
      const article = await prisma.article.findUnique({ where: { id: id }});
      if (!article) {
        const err = new Error('article를 찾을 수 없습니다.');
        err.status = 404;
        return err;
      }
      return article;
    } catch(err) {
      return err;
    }
  }

  static createArticle = async (article:Prisma.ArticleCreateInput) => {
    try {
      const newArticle = await prisma.article.create({ data: article });
      return newArticle;
    } catch(err) {
      return err;
    }
  }

  static updateArticle = async (id: number, article:Prisma.ArticleUpdateInput) => {
    try {
      const updatedArticle = await prisma.article.update({ where: { id: id }, data: article });
      return updatedArticle;
    } catch(err) {
      return err;
    }
    
  }

  static deleteArticle = async (id: number) => {
    try {
      const deletedArticle = await prisma.article.delete({ where: { id: id } });
      return deletedArticle;
    } catch(err) {
      return err;
    }
  }
}
  
export default ArticleRepository;