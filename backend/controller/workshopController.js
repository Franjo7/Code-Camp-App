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
    try{
        const workshops = await Workshop.find();
        const professors = await Workshop.find({professor:req.user.user._id});  

        if(workshops.length === 0){
            return res.status(404).json({message:"Workshop not found"});
        }
        res.status(200).json(workshops);

    } catch (error) {
        console.error(`Error in fetchWorkshop controller: ${error}`);
        res.status(500).json({error:"Internal Server Error" });
    }
};

// Dohvatanje radionice po ID

export const fetchById = async (req, res) => {
    try{
        const id = req.params.id;
        const workshop = await Workshop.findOne({_id:id});
        if(!workshop){
            return res.status(404).json({message:"Workshop not found"});
        }
        res.status(200).json(workshop);

    } catch (error) {
        console.error(`Error in fetchById controller: ${error}`);
        res.status(500).json({error:"Internal Server Error" });
    }
};
