import express from 'express';
import { create, getUserById , update,deleteUser,login, getAllProfessors,forgotPassword,resetPassword} from '../controller/userController.js';
import {verifyToken} from '../utils/verifyUser.js';



const route = express.Router();

route.post('/register',create);

route.post('/login',login);

route.post('/forgotPassword',forgotPassword);

route.put('/resetPassword',verifyToken,resetPassword);

route.put('/update/:id',verifyToken,update);

route.delete('/delete/:id',verifyToken,deleteUser);

route.get('/getUser/:id',getUserById);

route.get('/getProfessors',getAllProfessors);



export default route;


