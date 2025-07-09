import * as dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
// import router from './routes/index';
import { notFoundErrorHandeler, errorHandler } from './utills/errorHandler'
import passport from 'passport';
import articleController from './controller/article-controller';
import productController from './controller/product-controller';

const corsOptions = {
  origin: ['http://127.0.0.1:3000', 'https://three-sprint-mission-4goe.onrender.com'],
};

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

// app.use(router);
app.use('/article', articleController);
app.use('/produtc', productController);
app.use('', notFoundErrorHandeler);
app.use('', errorHandler)




app.listen(process.env.PORT || 3000, () => console.log('Server Started'));