
import Test from '../model/testModel.js';
import User from '../model/userModel.js';
import Workshop from '../model/workshopModel.js';
import multer from 'multer';


const upload = multer({ dest: 'uploads/' });

export const createTest = async (req, res) => {
    try {
        const userId = req.user.user._id;
        const { workshopId } = req.body;

        console.log(userId, workshopId);

        const userExist = await User.findOne({ _id: userId });
       const workshopExist = await Workshop.findOne({ _id: workshopId });

        if (!userExist || !workshopExist) {
            return res.status(404).json({ message: 'User or Workshop not found' });
        }

        console.log(req.file);  
        
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

      
        const test = new Test({
            userId,
            workshopId,
            file: {
                data: req.file.filename, 
                contentType: req.file.mimetype
            }
        });


        const savedTest = await test.save();
        res.status(201).json(savedTest);
    } catch (error) {
        console.error(`Error in createTest controller: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





