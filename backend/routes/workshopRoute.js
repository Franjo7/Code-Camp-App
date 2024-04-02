import express from "express";
import { create ,fetch,update,deleteWorkshop} from "../controller/workshopController.js";
import {verifyToken} from '../utils/verifyUser.js';



const workshopRoute = express.Router();


workshopRoute.get('/',fetch)
workshopRoute.post('/create',verifyToken,create);  
workshopRoute.put('/update/:id',verifyToken,update);
workshopRoute.delete('/delete/:id',verifyToken,deleteWorkshop);




export default workshopRoute;