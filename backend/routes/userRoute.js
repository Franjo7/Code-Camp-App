import express from 'express';
import { create, getUserById , update,deleteUser,login,getAllUsers} from '../controller/userController.js';
import {verifyToken} from '../utils/verifyUser.js';


const route = express.Router();


//Registracija
route.post('/register',create);

//Logiranje
route.post('/login',login);

route.put('/update/:id',verifyToken,update);

route.delete('/delete/:id',deleteUser);

route.get('/getUser/:id',getUserById);

route.get('/allUsers',getAllUsers);




export default route;


