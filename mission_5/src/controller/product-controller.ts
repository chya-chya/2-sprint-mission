import express from 'express';
import productLikedService from '../service/product/product-liked-service.js';
import productCommentService from '../service/product/product-comment-service.js';
import productService from '../service/product/product-service.js';

const productController = express.Router();
