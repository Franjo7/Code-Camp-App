import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import adminRoute from './routes/adminRoute.js';
import userRoute from './routes/userRoute.js';
import workshopRoute from './routes/workshopRoute.js';
import applicationRoute from './routes/applicationRoute.js';
import testRoute from './routes/testRoute.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';


const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST','PUT','DELETE'],
        credentials:true,
    },
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
    req.io = io;
    next();
});


app.use('/api/admin', adminRoute);
app.use('/api/user', userRoute);
app.use('/api/workshop', workshopRoute);
app.use('/api/application', applicationRoute);
app.use('/api/test', testRoute);

// socket logika

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', (reason) => {
        console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
    });
});


dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.DATABASE_URL;

mongoose.connect(MONGOURL).then(() => {
    console.log('Database connected');
    server.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    });
}).catch((error) => {
    console.log('Error connecting to database', error);
});



 
  







