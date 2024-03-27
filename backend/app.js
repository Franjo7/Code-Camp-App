import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import route from './routes/userRoute.js';
import workshopRoute from './routes/workshopRoute.js';
import registrationRoute from './routes/registrationRoute.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
//import userModel from './model/userModel.js';



const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", " Content-Type ");
    next();
  }); 




dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.DATABASE_URL;

mongoose.connect(MONGOURL).then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    });
}).catch((error) => {
    console.log('Error connecting to database', error);
});
 
  



app.use('/api/user', route);
app.use('/api/workshop', workshopRoute);
app.use('/api/campRegistration', registrationRoute);



