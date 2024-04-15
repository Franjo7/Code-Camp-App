import express from "express";
import { create ,fetch,update,deleteWorkshop,fetchById,Visibility} from "../controller/workshopController.js";
import {verifyToken} from '../utils/verifyUser.js';
import { verifyProfessor } from "../utils/verifyProfessor.js";



const workshopRoute = express.Router();


workshopRoute.get('/',fetch);
workshopRoute.get('/:id',fetchById);
workshopRoute.post('/create',verifyToken,verifyProfessor,create);  
workshopRoute.put('/update/:id',verifyToken,verifyProfessor,update);
workshopRoute.delete('/delete/:id',verifyToken,verifyProfessor,deleteWorkshop);
workshopRoute.put('/visibility/:id',verifyToken,verifyProfessor,Visibility);




export default workshopRoute;