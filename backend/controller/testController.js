
import Test from '../model/testModel.js';
import User from '../model/userModel.js';
import Workshop from '../model/workshopModel.js';
import {Binary} from 'mongodb';


// Funkcija za kreiranje testa
export const createTest = async (req, res) => {
    try {
        const userId = req.user.user._id;
        const { workshopId } = req.body;

        const userExist = await User.findOne({ _id: userId });
        const workshopExist = await Workshop.findOne({ _id: workshopId });

        if (!userExist || !workshopExist) {
            return res.status(404).json({ message: 'User or Workshop not found' });
        }
  
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileData = req.file.buffer;
        const fileContentType = req.file.mimetype;

        const test = new Test({
            userId,
            workshopId,
            file: {
                data: new Binary(fileData),
                contentType: fileContentType,
                filename: req.file.originalname
            }
        });

        const savedTest = await test.save();
        res.status(201).json(savedTest);
    } catch (error) {
        console.error(`Error in createTest controller: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Funkcija za dohvatanje svih testova
export const getAllTest = async (req, res) => {
    try {
        const tests = await Test.find();

        if (!tests || tests.length === 0) {
            return res.status(404).json({ message: 'No tests found' });
        }

        const formattedTests = await Promise.all(
            tests.map(async (test) => {
                const userId = test.userId;
                const workshopId = test.workshopId;

                const foundUser = await User.findOne({ _id: userId }).lean();
                const foundWorkshop = await Workshop.findOne({ _id: workshopId }).lean();

                const user = foundUser || { firstName: 'User', lastName: 'Deleted' };
                const workshop = foundWorkshop || { name: 'Workshop Deleted' };

                return {
                    _id: test._id,
                    user: user.firstName + ' ' + user.lastName,
                    workshop: workshop.name,
                    date: test.date.toISOString().slice(0, 10),
                    downloadLink: `test/download/${test._id}`,
                    fileName: test.file.filename
                };
            })
        );

        res.status(200).json(formattedTests);
    } catch (error) {
        console.error(`Error in getAllTests controller: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Funkcija za brisanje testa
export const deleteTest = async (req, res) => {
    try {
        const testId = req.params.id;
        const test = await Test.findById(testId);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        await Test.findByIdAndDelete(testId);
        res.status(200).json({ message: 'Test deleted successfully' });
    } catch (error) {
        console.error(`Error in deleteTest controller: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};








export const downloadTest = async (req, res) => {
    try {
        const testId = req.params.id;
        const test = await Test.findById(testId);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        const hexData = test.file.data;
        const binaryData = Buffer.from(hexData, 'hex');

        const fileName = test.file.filename;

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        res.send(binaryData);
    } catch (error) {
        console.error(`Error in downloadTest controller: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





