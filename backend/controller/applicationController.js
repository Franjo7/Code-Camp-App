
import Workshop from '../model/workshopModel.js';
import Application from '../model/applicationModel.js';
import User from '../model/userModel.js';
import { sendEmail } from '../utils/mailer.js';


// Funkcija za prijavu na radionicu
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




// Funkcija za uređivanje prijave na radionicu

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

        // Dohvatiti korisnika i radiomicu  na osnovu reference iz prijave

        const student = await User.findById(application.user);
        if (!student) {
            return res.status(404).json({ message: 'User not found' });
        }

        const workshop = await Workshop.findById(application.workshop);
        if (!workshop) {
            return res.status(404).json({ message: 'Workshop not found' });
        }

        const isStatusChanged = req.body.status && req.body.status !== application.status;

        const updatedFields = {
            status: req.body.status || application.status,
            points: req.body.points || application.points,
            evaluation: req.body.evaluation || application.evaluation,
            remark: req.body.remark || application.remark
        };

        const updatedApplication = await Application.findByIdAndUpdate(id, updatedFields, { new: true });

        if (isStatusChanged) {
            const studentEmail = student.email;
            const workshopName = workshop.name;
            const newStatus = req.body.status;

            let subject,message;

            if(newStatus === 'Approved'){
                subject = 'Application Status';
                message = `Poštovani ${student.firstName} ${student.lastName},\n\nVaša prijava za radionicu ${workshopName} je odobrena.\n\nLijep pozdrav!,\nglobalsoft tim.`;
            } else if(newStatus === 'Rejected'){
                subject = 'Application Status';
                message = `Poštovani ${student.firstName} ${student.lastName},\n\nVaša prijava za radionicu ${workshopName} je odbijena.\n\nPokušajte ponovo u sljedećem ciklusu\n\nLijep pozdrav!,\nglobalsoft tim.`;
            }

            if (subject && message) {
                await sendEmail(studentEmail, subject, message);
            }
        }

        res.status(200).json(updatedApplication);
    } catch (error) {
        console.error(`Error in manageApplication controller: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// Funkcija za brisanje prijave na radionicu
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



// Funkcija za dohvaćanje svih prijava na radionice
export const getAllApplicationsForWorkshop = async (req, res) => {
    try {
       
 
        const applications = await Application.find();

        const applicationsWithName = await Promise.all(applications.map(async (application) => {
            const userId = application.user;
            const workshopId = application.workshop;
            const foundUser = await User.findOne({ _id: userId }).lean();
            const foundWorkshop = await Workshop.findOne({ _id: workshopId }).lean();
            
            const user = foundUser || { firstName: 'User', lastName: 'Deleted' };
            const workshop = foundWorkshop || { name: 'Workshop Deleted' };

            
            return {
                _id: application._id,
                user: user.firstName + ' ' + user.lastName ,
                workshop: workshop.name,
                status: application.status,
                registrationDate: application.registrationDate.toISOString().slice(0, 10),
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




// Funkcija za dohvaćanje svih prijava korisnika
export const getAllApplicationsForUser = async (req, res) => {
    try {
        const userId = req.user.user._id;
        const user = req.params.id;

        if(userId !== user){
            return res.status(403).json({ message: 'You are not authorized to view this applications' });
        }
        
        const applications = await Application.find({ user: userId });


        const applicationsWithName = await Promise.all(applications.map(async (application) => {
            const workshopId = application.workshop;

            const workshop = await Workshop.findOne({ _id: workshopId }).lean();

           if (!workshop) {
                return { error: 'Workshop not found' };
            }

            if(application.status === 'Pending...' || application.status === 'Rejected'){

                return {
                    workshopId:workshop._id,
                    workshop: workshop.name,
                    status: application.status,
                    registrationDate: application.registrationDate.toISOString().slice(0, 10),
                };

            } else {

                return {
                    _id: application._id,
                    workshopId:workshop._id,
                    workshop: workshop.name,
                    StartDate: workshop.StartDate.toISOString().slice(0, 10),
                    EndDate: workshop.EndDate.toISOString().slice(0, 10),
                    status: application.status,
                    registrationDate: application.registrationDate.toISOString().slice(0, 10),
                    points: application.points,
                    evaluation: application.evaluation,
                    remark: application.remark
                };
            }
        }));

        res.status(200).json(applicationsWithName.filter(application => !application.error));
    } catch (error) {
        console.error(`Error in getAllApplicationsForUser controller: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//Funkcija za dohvaćanje prijave na radionicu
export const getApplicationForWorkshop = async (req, res) => {
    try {
      
        const applicationId = req.params.id;
        const application = await Application.findOne({ _id:applicationId  })
        const {user,workshop} = application;
       

        if (!application) {
            return res.status(404).json({ message: 'Application not found for this user' });
        }


        const user_ = await User.findOne({ _id: user }).lean();
        const workshop_ = await Workshop.findOne({ _id: workshop }).lean();

        if (!user_ || !workshop_) {
            return res.status(404).json({ error: 'User or Workshop not found' });
        }

        const applicationData = {
            _id: application._id,
            user: user_.firstName + ' ' + user_.lastName,
            workshop: workshop_.name,
            status: application.status,
            registrationDate: application.registrationDate.toISOString().slice(0, 10),
            points: application.points,
            evaluation: application.evaluation,
            remark: application.remark
        };

        res.status(200).json(applicationData);

    } catch (error) {
        console.error(`Error in getAllApplicationsForWorkshop controller: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

