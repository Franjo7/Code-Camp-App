import express from 'express';
import {createTest} from '../controller/testController.js';
import { verifyToken } from '../utils/verifyUser.js';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });


const testRoute = express.Router();

testRoute.post('/createTest',verifyToken, upload.single('file'),createTest);


export default testRoute;