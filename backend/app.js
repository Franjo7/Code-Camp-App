import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import route from './routes/userRoute.js';
import workshopRoute from './routes/workshopRoute.js';
import registrationRoute from './routes/registrationRoute.js';


const app = express();
app.use(express.json());


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

 
