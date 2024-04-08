import express from 'express';
import {update,getAllUsers,deleteUser} from '../controller/adminController.js';
import {verifyToken} from '../utils/verifyUser.js';
import {verifyAdmin} from '../utils/verifyAdmin.js';

const adminRoute = express.Router();



adminRoute.put('/update/:id',verifyToken,verifyAdmin,update);
adminRoute.delete('/delete/:id',verifyToken,verifyAdmin,deleteUser);
adminRoute.get('/users',verifyToken,verifyAdmin,getAllUsers);


export default adminRoute;
