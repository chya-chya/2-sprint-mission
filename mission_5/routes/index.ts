import express from 'express';
import productRouter from './product/product';
import articleRouter from './article/article';
import articleCommentRouter from './article/articleComment';
import productCommentRouter from './product/productComment';
import fileRouter from './file';
import authRouter from './user/auth';
import userRouter from './user/user';
import productLikedRouter from './product/productLiked';
import articleLikedRouter from './article/articleLiked';
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