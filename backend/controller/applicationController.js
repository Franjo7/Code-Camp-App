
import Workshop from '../model/workshopModel.js';
import Application from '../model/applicationModel.js';
import User from '../model/userModel.js';

export const applicationForWorkshop = async (req, res) => {
    try {
        
        const newApplication = new Application(req.body);
        const { user, workshop } = newApplication;

        const userExist  = await User.findOne({ _id: user });
        const workshopExist =  await Workshop.findOne({ _id: workshop });

        if (!userExist || !workshopExist) {
            return res.status(404).json({ message: 'User or Workshop not found' });
        };

        const existingApplication = await Application.findOne({ user:user,workshop:workshop });

        if(existingApplication){
            return res.status(400).json({ message: 'User already registered for this workshop' });
        };


        const savedApplication = await newApplication.save();
        res.status(201).json(savedApplication);

    } catch (error) {
        console.error(`Error in applicationForWorkshop controller: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





export const manageApplication = async (req, res) => {
    try {
        const user = req.user.user._id;
        const userRole = req.user.user.role;

        if (!user || !userRole.includes('professor')) {
            return res.status(403).json({ message: 'Only professors can manage application' });
        }

        const id = req.params.id;
        const application = await Application.findOne({ _id: id });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        const updatedFields = {
            status: req.body.status || application.status,
            points: req.body.points || application.points,
            evaluation: req.body.evaluation || application.evaluation,
            remark: req.body.remark || application.remark
        };

        const updatedApplication = await Application.findByIdAndUpdate(id, updatedFields, { new: true });

        res.status(200).json(updatedApplication);
    } catch (error) {
        console.error(`Error in manageApplication controller: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




export const deleteApplication  =  async (req, res) => {
    try{

        const userId = req.user.user._id;
        const applicationId = req.params.id;
        const userRole = req.user.user.role;
    
        const application = await Application.findOne({ _id: applicationId });

        if(!application){
            return res.status(404).json({message: 'Application not found'});
        }

        if((userRole.includes('professor'))){
           
            await Application.findByIdAndDelete(applicationId);
            res.status(200).json({message: 'Application deleted successfully'});

        } else if(application.user.toString() === userId){

            await Application.findByIdAndDelete(applicationId);
            res.status(200).json({message: 'Application deleted successfully'});

        } else{
            return res.status(403).json({message: 'You are not authorized to delete this application'});
        }

    }catch(error){
        console.log(`Error in deleteApplication controller: ${error}`);
        res.status(500).json({error: 'Internal Server Error'});
    }
};




export const getAllApplicationsForWorkshop = async (req, res) => {
    try {
        const userId = req.user.user._id;
        const role = req.user.user.role;

        if (!userId || !role.includes('professor')) {
            return res.status(403).json({ message: 'Only professors can view applications' });
        }

        const applications = await Application.find();

        const applicationsWithName = await Promise.all(applications.map(async (application) => {
            const userId = application.user;
            const workshopId = application.workshop;

            const user = await User.findOne({ _id: userId }).lean();
            const workshop = await Workshop.findOne({ _id: workshopId }).lean();

           if (!user || !workshop) {
                return { error: 'User or Workshop not found' };
            }
            

            return {
                _id: application._id,
                user: user.firstName + ' ' + user.lastName,
                workshop: workshop.name,
                status: application.status,
                registrationDate: application.registrationDate.toDateString().split(' ').slice(1).join(' '),
                points: application.points,
                evaluation: application.evaluation,
                remark: application.remark
            };
        }));

        res.status(200).json(applicationsWithName.filter(application => !application.error));

    } catch (error) {
        console.error(`Error in getAllApplicationsForWorkshop controller: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}





export const getAllApplicationsForUser = async (req, res) => {
    try {
        const userId = req.user.user._id;
        const user = req.params.id;

        if(userId !== user){
            return res.status(403).json({ message: 'You are not authorized to view this applications' });
        }
        
        const applications = await Application.find({ user: userId }).sort({ workshop: 1 });

        res.status(200).json(applications);

    } catch (error) {
        console.error(`Error in getAllApplicationsForUser controller: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


