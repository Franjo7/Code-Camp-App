import jwt from 'jsonwebtoken';
import Workshop from '../model/workshopModel.js';
import Registration from '../model/registrationModel.js';

export const registerForWorkshop = async (req, res) => {
    try {
        // Provjera tokena
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

       /*

        // Provjera postojanja radionice
        const saveWorkshop  = new Workshop(req.body);
        const { _id } = saveWorkshop;
        const workshopExist = await Workshop.findById(saveWorkshop.id);
        if (!workshopExist) {
            return res.status(404).json({ message: 'Workshop not found' });
        }
        */
       
        // Provjera postojanja registracije
        const existingRegistration = await Registration.findOne({ user: userId, workshop: workshopId });
        if (existingRegistration) {
            return res.status(400).json({ message: 'User is already registered for this workshop' });
        }

        // Stvaranje nove registracije
        const newRegistration = new Registration({
            user: userId,
            workshop: workshop,
            registrationDate: new Date(),
            status: 'pending'
        });

        // Pohrana registracije
        const savedRegistration = await newRegistration.save();

        res.status(201).json(savedRegistration);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const fetchRegistrations = async (req, res) => { 
    try {
        const registrations = await registrations.find();
        
        if (registrations.length === 0) {
            return res.status(404).json({ message: "Registrations not found" });
        }
        
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

