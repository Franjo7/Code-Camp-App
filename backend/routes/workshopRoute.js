import express from "express";
import { create ,fetch,update,deleteWorkshop} from "../controller/workshopController.js";



const workshopRoute = express.Router();


workshopRoute.get('/',fetch)
workshopRoute.post('/create',create);  
workshopRoute.put('/update/:id',update);
workshopRoute.delete('/delete/:id',deleteWorkshop);




export default workshopRoute;