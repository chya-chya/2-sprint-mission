import express from 'express';
import productLikedService from '../service/product/product-liked-service';
import productCommentService from '../service/product/product-comment-service';
import productService from '../service/product/product-service';
import passport from '../lib/passport/index';
import { optionalAuth } from '../utills/auth';
const productController = express.Router();

productController.get('/', optionalAuth, productService.getProducts);
productController.get('/:id', optionalAuth, productService.getProductById);
productController.post('/',
  passport.authenticate('access-token', { session: false }),
  productService.createProduct);
productController.patch('/:id',
  passport.authenticate('access-token', { session: false }),
  productService.updateProduct);
productController.delete('/:id',
  passport.authenticate('access-token', { session: false }),
  productService.deleteProduct);

productController.get('/comments', productCommentService.getProductComments);
productController.post('/:productId/comments',
  passport.authenticate('access-token', { session: false }),
  productCommentService.createProductComment);
productController.patch('/:productId/comments',
  passport.authenticate('access-token', { session: false }),
  productCommentService.updateProductComment);
productController.delete('/:productId/comments',
  passport.authenticate('access-token', { session: false }),
  productCommentService.deleteProductComment);

productController.get('/:productId/liked', productLikedService.getProductLiked);
productController.post('/:productId/liked',
  passport.authenticate('access-token', { session: false }),
  productLikedService.createProductLiked);
productController.delete('/:productId/liked',
  passport.authenticate('access-token', { session: false }),
  productLikedService.deleteProductLiked);

export default productController;