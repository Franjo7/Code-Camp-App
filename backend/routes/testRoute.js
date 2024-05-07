import express from 'express';
import {createTest,getAllTest,downloadTest,deleteTest} from '../controller/testController.js';
import { verifyToken } from '../utils/verifyUser.js';
import {verifyProfessor} from '../utils/verifyProfessor.js';
import upload from '../utils/fileUpload.js';

const testRoute = express.Router();

testRoute.post('/createTest',verifyToken, upload.single('file'),createTest);

testRoute.get('/getAllTests',verifyToken,verifyProfessor,getAllTest);

testRoute.get('/download/:id',downloadTest);

testRoute.delete('/deleteTest/:id',verifyToken,verifyProfessor,deleteTest);

export default testRoute;