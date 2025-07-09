import express from 'express';
import articleLikedService from '../service/article/article-liked-service.js';
import articleCommentService from '../service/article/article-comment-service.js';
import articleService from '../service/article/article-service.js';

const articleController = express.Router();

articleController.get('/', articleService.getArticles);
articleController.post('/', articleService.createArticle);
articleController.get('/:id', articleService.getArticleById);
articleController.patch('/:id', articleService.updateArticle);
articleController.delete('/:id', articleService.deleteArticle);

articleController.get('/comments', articleCommentService.getArticleComments);
articleController.post('/:articleId/comments', articleCommentService.createArticleComment);
articleController.patch('/:articleId/comments', articleCommentService.updateArticleComment);
articleController.delete('/:articleId/comments', articleCommentService.deleteArticleComment);

articleController.get('/:articleId/liked', articleLikedService.getArticleLiked);
articleController.post('/:articleId/liked', articleLikedService.createArticleLiked);
articleController.delete('/:articleId/liked', articleLikedService.deleteArticleLiked);

export default articleController;