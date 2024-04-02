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
            
        if(!user || !userRole.includes('admin')){
            return res.status(403).json({ message: 'Only administrators can create workshops' });
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
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Azuriranje radionice

export const update = async (req, res) => {
   try{
        const user = req.user.user._id;
        const userRole = req.user.user.role;
        
    if(!user || !userRole.includes('admin')){
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
    res.status(500).json({error:"Internal Server Error" });
   }
};

// Brisanje radionice
export const deleteWorkshop = async (req, res) => {
    try{

        const user = req.user.user._id;
        const userRole = req.user.user.role;
        
    if(!user || !userRole.includes('admin')){
        return res.status(403).json({ message: 'Only administrators can delete workshops' });
    }
        const id= req.params.id;
        const workshopExist = await Workshop.findOne({_id:id});
        if(!workshopExist){
            return res.status(404).json({message:"Workshop not found"});
        }

        await Workshop.findByIdAndDelete(id);
        res.status(201).json({message:"Workshop deleted successfully"});

    } catch (error) {
        res.status(500).json({error:"Internal Server Error" });
    }   
};

// Dohvatanje radionica
export const fetch = async (req, res) => { 
    try{
        const workshops = await Workshop.find();
        
        if(workshops.length === 0){
            return res.status(404).json({message:"Workshop not found"});
        }
        res.status(200).json(workshops);

    } catch (error) {
        res.status(500).json({error:"Internal Server Error" });
    }
};