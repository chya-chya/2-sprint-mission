import express from 'express';
import productRouter from './product.js';
import articleRouter from './article.js';
import articleCommentRouter from './articleComment.js';
import productCommentRouter from './productComment.js';
import fileRouter from './file.js';
import authRouter from './auth.js';
import userRouter from './user.js';
import productLikedRouter from './productLiked.js';
import articleLikedRouter from './articleLiked.js';
const router = express.Router();

router.use('/product', productRouter);
router.use('/article', articleRouter);
router.use('/articleComment', articleCommentRouter);
router.use('/productComment', productCommentRouter);
router.use('/file', fileRouter);
router.use('/file', express.static('uploads'));
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/productLiked', productLikedRouter);
router.use('/articleLiked', articleLikedRouter);

export default router;