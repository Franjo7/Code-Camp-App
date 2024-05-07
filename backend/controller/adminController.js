import User from "../model/userModel.js";
import Application from "../model/applicationModel.js";
import Workshop from "../model/workshopModel.js";
import Test from "../model/testModel.js";



// Funkcija za dohvacanje svih korisnika od strane admina 
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        console.log(`Error in getAllUsers controller: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Funkcija za azuriranje korisnika od strane admina, gdje admin moze azurirati sve podatke korisnika osim lozinke
export const update = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const user = await User.findById(targetUserId);
   
            const updateUser = await User.findByIdAndUpdate(
                targetUserId,
                {
                    $set:{
                        firstName: req.body.firstName || user.firstName,
                        lastName: req.body.lastName || user.lastName,
                        tel: req.body.tel || user.tel,
                        email: req.body.email || user.email,
                        password: user.password,
                        role: req.body.role || user.role
                    }
                },
                { new: true }
            );

            const { password, ...rest } = updateUser._doc;
            return res.status(201).json(rest);

    } catch (error) {
        console.log(error);
        console.log(`Error in update controller: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



// funkcija za brisanje korisnika od strane admina
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        
            await Workshop.updateMany({ professor: id }, { $unset: { professor:1}});
            await Application.updateMany({ user: id }, { $unset: { user:1}});
            await Test.updateMany({ userId: id }, { $unset: { userId:1}});

            await User.findByIdAndDelete(id);
            return res.status(200).json({ message: "User deleted successfully" });
         
    } catch (error) {
        console.log(`Error in deleteUser controller: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



