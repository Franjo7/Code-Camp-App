import Registration from '../model/registrationModel.js';
import jwt from 'jsonwebtoken';
import Workshop from '../model/workshopModel.js'; 

// Registrirajte korisnika za radionicu
export const registerForWorkshop = async (req, res) => {
    try {
        

        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

       
        const { workshopId } = req.body;

        const workshop = await Workshop.findById(workshopId);
        if (!workshop) {
            return res.status(404).json({ message: 'Workshop not found' });
        }

     
        const existingRegistration = await Registration.findOne({ user: userId, workshop: workshopId });
        if (existingRegistration) {
            return res.status(400).json({ message: 'User is already registered for this workshop' });
        }

     
        const newRegistration = new Registration({
            user: userId,
            workshop: workshopId,
            registrationDate: new Date(),
            status: 'pending'
        });

        
        const savedRegistration = await newRegistration.save();

        res.status(201).json(savedRegistration);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export const fetchRegistrations = async (req, res) => { 
    try {
        const registrations = await registration.find();
        
        if (registrations.length === 0) {
            return res.status(404).json({ message: "Registrations not found" });
        }
        
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

