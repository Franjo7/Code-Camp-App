import express from 'express';
import { create, getUserById , update,deleteUser,login,getAllUsers} from '../controller/userController.js';
import {verifyToken} from '../utils/verifyUser.js';
import {verifyAdmin} from '../utils/verifyAdmin.js';


const route = express.Router();

route.post('/register',create);

route.post('/login',login);

route.put('/update/:id',verifyToken,update);

route.delete('/delete/:id',verifyToken,deleteUser);

route.get('/getUser/:id',getUserById);

route.get('/allUsers',verifyToken,verifyAdmin,getAllUsers);


export default route;


