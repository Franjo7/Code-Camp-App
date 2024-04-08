import User from "../model/userModel.js";


export const update = async (req, res) => {
    try {
        const userRole = req.user.user.role;
        const targetUserId = req.params.id;

    
        if (userRole.includes("admin")) {
           
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
            
        } else {
            return res.status(403).json({ 
                error: { 
                    message: "You are not authorized to update this user",
                    code: 403
                } 
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ deleted: { $ne: true } });
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userRole = req.user.user.role;
        
        if (userRole.includes("admin")) {
            
            await User.findByIdAndDelete(id);
            return res.status(200).json({ message: "User deleted successfully" });
        } 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



