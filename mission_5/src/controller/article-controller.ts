import express from 'express';
import articleLikedService from '../service/article/article-liked-service';
import articleCommentService from '../service/article/article-comment-service';
import articleService from '../service/article/article-service';
import { optionalAuth } from '../utills/auth';
import passport from '../lib/passport/index';
const articleController = express.Router();

articleController.get('/', 
  optionalAuth,
  articleService.getArticles);
articleController.get('/:articleId',
  optionalAuth,
  articleService.getArticleById);
articleController.post('/',
  passport.authenticate('access-token', { session: false }),
  articleService.createArticle);
articleController.patch('/:articleId',
  passport.authenticate('access-token', { session: false }),
  articleService.updateArticle);
articleController.delete('/:articleId',
  passport.authenticate('access-token', { session: false }),
  articleService.deleteArticle);

articleController.get('/comments', articleCommentService.getArticleComments);
articleController.post('/:articleId/comments',
  passport.authenticate('access-token', { session: false }),
  articleCommentService.createArticleComment);
articleController.patch('/:articleId/comments',
  passport.authenticate('access-token', { session: false }),
  articleCommentService.updateArticleComment);
articleController.delete('/:articleId/comments',
  passport.authenticate('access-token', { session: false }),
  articleCommentService.deleteArticleComment);

articleController.get('/:articleId/liked',
  passport.authenticate('access-token', { session: false }),
  articleLikedService.getArticleLiked);
articleController.post('/:articleId/liked',
  passport.authenticate('access-token', { session: false }),
  articleLikedService.createArticleLiked);
articleController.delete('/:articleId/liked',
  passport.authenticate('access-token', { session: false }),
  articleLikedService.deleteArticleLiked);

export default articleController;