import express from 'express';
import fileService from '../service/file/file-service.js';

const fileController = express.Router();

fileController.post('', fileService.uploadFile);

export default fileController;
