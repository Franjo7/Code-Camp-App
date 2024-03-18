import express from 'express';
import {registerForWorkshop,fetchRegistrations} from '../controller/registrationController.js';


const registrationRoute = express.Router();



registrationRoute.post('/registerBasic',registerForWorkshop);
registrationRoute.get('/',fetchRegistrations);


export default registrationRoute;