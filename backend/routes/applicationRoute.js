import express from 'express';
import {applicationForWorkshop,manageApplication,deleteApplication,getAllApplicationsForWorkshop,getAllApplicationsForUser} from '../controller/applicationController.js';
import{verifyToken} from '../utils/verifyUser.js';
import{verifyProfessor} from '../utils/verifyProfessor.js';


const applicationRoute = express.Router();



applicationRoute.post('/workshopApplication',verifyToken,applicationForWorkshop);
applicationRoute.put('/manageApplication/:id',verifyToken,verifyProfessor,manageApplication);
applicationRoute.delete('/deleteApplication/:id',verifyToken,deleteApplication);
applicationRoute.get('/applicationsForWorkshop',verifyToken,verifyProfessor,getAllApplicationsForWorkshop);
applicationRoute.get('/applicationsForUser/:id',verifyToken,getAllApplicationsForUser);


export default applicationRoute;