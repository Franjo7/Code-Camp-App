import Workshop from "../model/workshopModel.js";
import User from "../model/userModel.js";
import dotenv from 'dotenv';
dotenv.config();


//Funkcija za kreiranje radionice
export const create = async (req, res) => { 
    try {
        
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


// Funkcija za azuriranje radionice
export const update = async (req, res) => {
   try{
        const id = req.params.id;
        const workshopExist = await Workshop.findOne({_id:id});

        if(!workshopExist){
            return res.status(404).json({message:"Workshop not found"});
        }

        const {StartDate,EndDate,...otherFields} = req.body;
        const updatedWorkshopData = {...otherFields, StartDate: new Date(StartDate), EndDate: new Date(EndDate)};

        const updateWorkshop = await Workshop.findByIdAndUpdate(id,updatedWorkshopData,{new:true});
        res.status(201).json(updateWorkshop);

   } catch (error) {
        console.error(`Error in updateWorkshop controller: ${error}`);
        res.status(500).json({error:"Internal Server Error" });
   }
};

// Funkcija za brisanje radionice
export const deleteWorkshop = async (req, res) => {
    try{
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


// Funkcija za dohvatanje svih radionica
    export const fetch = async (req, res) => {
        try {
            const workshops = await Workshop.find();

            if (workshops.length === 0) {
                return res.status(404).json({ message: "Workshops not found" });
            }


            const workshopsWithProfessorName = await Promise.all(workshops.map(async (workshop) => {
                const professorId = workshop.professor;
                const foundProfessor = await User.findOne({ _id: professorId });

                const professor  = foundProfessor || { firstName: 'Unknown', lastName: 'Professor' };
                     
                return {
                    _id: workshop._id,
                    name: workshop.name,
                    description: workshop.description,
                    StartDate: workshop.StartDate.toDateString().split(' ').slice(1).join(' '),
                    EndDate: workshop.EndDate.toDateString().split(' ').slice(1).join(' '),
                    professor: professor.firstName + ' ' + professor.lastName,
                    Visibility: workshop.Visibility
                };
            }));

            res.status(200).json(workshopsWithProfessorName);

        } catch (error) {
            console.error(`Error in fetch  controller: ${error}`);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };


// Funkcija za dohvatanje  radionice po id
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
            StartDate: workshop.StartDate.toISOString().slice(0, 10),
            EndDate: workshop.EndDate.toISOString().slice(0, 10),
            professor: professor.firstName + ' ' + professor.lastName,
            Visibility: workshop.Visibility
        };

        res.status(200).json(responseData);

    } catch (error) {
        console.error(`Error in fetchById controller: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Azuriranje vidljivosti radionice
export const visibility = async (req, res) => {
    try {
        const id = req.params.id;
        const workshopExist = await Workshop.findOne({_id:id});

        if(!workshopExist){
            return res.status(404).json({message:"Workshop not found"});
        }

        const {Visibility} = req.body;
        const updatedWorkshopData = {Visibility};

        const updateWorkshop = await Workshop.findByIdAndUpdate(id,updatedWorkshopData,{new:true});
        res.status(201).json(updateWorkshop);

    } catch (error) {
        console.error(`Error in Visibility controller: ${error}`);
        res.status(500).json({error:"Internal Server Error" });
    }
}

// Funkcija za dohvatanje svih radionica koje su vidljive
export const fetchForUser = async (req, res) => {
    try {
        const workshops = await Workshop.find({Visibility: true});

        if (workshops.length == 0) {
            return res.status(404).json({ message: "Workshops not found" });
        }

        const workshopsWithProfessorName = await Promise.all(workshops.map(async (workshop) => {
            const professorId = workshop.professor;
            const foundProfessor = await User.findOne({ _id: professorId });
            
            const professor  = foundProfessor || { firstName: 'Unknown', lastName: 'Professor' };

            return {
                _id: workshop._id,
                name: workshop.name,
                description: workshop.description,
                StartDate: workshop.StartDate.toDateString().split(' ').slice(1).join(' '),
                EndDate: workshop.EndDate.toDateString().split(' ').slice(1).join(' '),
                professor: professor.firstName + ' ' + professor.lastName,
                Visibility: workshop.Visibility
            };
        }));

        res.status(200).json(workshopsWithProfessorName);

    } catch (error) {
        console.error(`Error in fetch controller: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




