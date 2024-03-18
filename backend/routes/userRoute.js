import express from 'express';
import { create, fetch , update,deleteUser,login} from '../controller/userController.js';

const route = express.Router();




//Registracija
route.post('/register',create);

//Logiranje
route.post('/login',login);

route.put('/update/:id',update);

route.delete('/delete/:id',deleteUser);

route.get('/',fetch);






export default route;


