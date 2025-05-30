import * as dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import productRouter from './routes/product.js';
import articleRouter from './routes/article.js';
import artiCommentRouter from './routes/artiComment.js';
import prodCommentRouter from './routes/prodComment.js';
import fileRouter from './routes/file.js';

const prisma = new PrismaClient();

const corsOptions = {
  origin: ['http://127.0.0.1:3000', 'https://three-sprint-mission-4goe.onrender.com'],
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use('', productRouter);
app.use('', articleRouter);
app.use('', artiCommentRouter);
app.use('', prodCommentRouter);
app.use('/file', fileRouter);
app.use('/file', express.static('uploads'));

app.use((req, res, next) => {
  res.status(404).send('요청하신 주소를 찾을 수 없습니다.');
});

app.use((err, req, res, next) => {
  console.log('****************************에러발생!****************************');
  console.log(err);
  res.status(err.status || 500).send('ERROR: ' + err.message);
});



app.listen(process.env.PORT || 3000, () => console.log('Server Started'));