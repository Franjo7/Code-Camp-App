import Workshop from "../model/workshopModel.js";
import User from "../model/userModel.js";
import  jwt  from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();





// Kreiranje radionice

export const create = async (req, res) => { 
    try {
        
        const user = req.user.user._id;
        const userRole = req.user.user.role;
            
        if(!user || !userRole.includes('professor')){
            return res.status(403).json({ message: 'Only professors can create workshops' });
        }

        const workshopData = new Workshop(req.body);
        const { name } = workshopData;

        const workshopExist = await Workshop.findOne({ name });

        if (workshopExist) {
            return res.status(400).json({ message: 'Workshop already exists' });
        }

        const savedWorkshop = await workshopData.save();
        res.status(201).json(savedWorkshop);
        
    } catch (error) {
        console.error(`Error in createWorkshop controller: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Azuriranje radionice

export const update = async (req, res) => {
   try{
        const user = req.user.user._id;
        const userRole = req.user.user.role;
        
    if(!user || !userRole.includes('professor')){
        return res.status(403).json({ message: 'Only administrators can update workshops' });
    }

    const id = req.params.id;
    const workshopExist = await Workshop.findOne({_id:id});

    if(!workshopExist){
        return res.status(404).json({message:"Workshop not found"});
    }

    const updateWorkshop = await Workshop.findByIdAndUpdate(id,req.body,{new:true});
    res.status(201).json(updateWorkshop);

   } catch (error) {
    console.error(`Error in updateWorkshop controller: ${error}`);
    res.status(500).json({error:"Internal Server Error" });
   }
};

// Brisanje radionice
export const deleteWorkshop = async (req, res) => {
    try{

        const user = req.user.user._id;
        const userRole = req.user.user.role;
        
    if(!user || !userRole.includes('professor')){
        return res.status(403).json({ message: 'Only professors can delete workshops' });
    }
        const id= req.params.id;
        const workshopExist = await Workshop.findOne({_id:id});
        if(!workshopExist){
            return res.status(404).json({message:"Workshop not found"});
        }

        await Workshop.findByIdAndDelete(id);
        res.status(201).json({message:"Workshop deleted successfully"});

    } catch (error) {
        console.error(`Error in deleteWorkshop controller: ${error}`);
        res.status(500).json({error:"Internal Server Error" });
    }   
};


// Dohvatanje radionica
export const fetch = async (req, res) => {
    try {
        const workshops = await Workshop.find();

        if (workshops.length === 0) {
            return res.status(404).json({ message: "Workshops not found" });
        }


        const workshopsWithProfessorName = await Promise.all(workshops.map(async (workshop) => {
            const professorId = workshop.professor;
            const professor = await User.findOne({ _id: professorId });
            if (!professor) {
                return res.status(404).json({ message: "Professor not found" });
            }
            return {
                _id: workshop._id,
                name: workshop.name,
                description: workshop.description,
                date: workshop.date.toDateString().split(' ').slice(1).join(' '),
                professor: professor.firstName + ' ' + professor.lastName
            };
        }));

        res.status(200).json(workshopsWithProfessorName);

    } catch (error) {
        console.error(`Error in fetch controller: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// dohvcanje radionice po id

export const fetchById = async (req, res) => {
    try {
        const id = req.params.id;
        const workshop = await Workshop.findOne({ _id: id });

        if (!workshop) {
            return res.status(404).json({ message: "Workshop not found" });
        }

        const professorId = workshop.professor;

        const professor = await User.findOne({ _id: professorId });

        if (!professor) {
            return res.status(404).json({ message: "Professor not found" });
        }

        const responseData = {
            _id: workshop._id,
            name: workshop.name,
            description: workshop.description,
            date: workshop.date.toISOString().slice(0, 10),
            professor: professor.firstName + ' ' + professor.lastName
        };

        res.status(200).json(responseData);

    } catch (error) {
        console.error(`Error in fetchById controller: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

