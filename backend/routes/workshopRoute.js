import express from "express";
import { create ,fetch,update,deleteWorkshop,fetchById,visibility} from "../controller/workshopController.js";
import {verifyToken} from '../utils/verifyUser.js';
import { verifyProfessor } from "../utils/verifyProfessor.js";



const workshopRoute = express.Router();


workshopRoute.get('/',verifyToken,verifyProfessor,fetch);
workshopRoute.get('/:id',verifyToken,fetchById);
workshopRoute.post('/create',verifyToken,verifyProfessor,create);  
workshopRoute.put('/update/:id',verifyToken,verifyProfessor,update);
workshopRoute.delete('/delete/:id',verifyToken,verifyProfessor,deleteWorkshop);
workshopRoute.put('/visibility/:id',verifyToken,verifyProfessor,visibility);




export default workshopRoute;