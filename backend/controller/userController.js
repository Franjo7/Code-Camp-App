import User from "../model/userModel.js";
import bcrypt from 'bcrypt';
import  jwt  from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();


// Kreiranje/registracija usera

export const create = async (req, res) => { 
    try{
        const savedUser  = new User(req.body);
        const {email,password} = savedUser;
        const userExist = await User.findOne({email});

        if(userExist){
            return res.status(400).json({message:"User already exist"});
        }

        const saltRounds = 10;
         const hashedPassword = await bcrypt.hash(password, saltRounds);

            savedUser.password = hashedPassword;
            const newUser = await savedUser.save();

            const payload ={
                user: {
                    _id:newUser._id,
                    role:newUser.role
                   
                }
            }

           const token =  jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1hr'});
            res.status(201).json({token});
        
    } catch (error) {
        res.status(500).json({error:"Internal Server Error" });
    }
};


// logiranje usera

export const login = async (req, res) => {
        const {email,password} = req.body;
    try{
       const user  = await User.findOne({email});

         if(!user){
            return res.status(400).json({message:"User not found"});
         }
        
         const isMatch = await bcrypt.compare(password,user.password);
            
         if(!isMatch){
                return res.status(400).json({message:"Invalid password"});
            }

        const payload ={
            user: {
                _id:user._id,
                role:user.role
            
            }
        };

        const token =  jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1hr'});
       
        res.status(200).json({token});

    } catch (error) {
        res.status(500).json({error:"Internal Server Error" });
    }
};





// Dohvatanje usera

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};







export const update = async (req, res) => {    
    try {
        const userIdFromToken = req.user.user._id
        const userRoleFromToken = req.user.user.role;
        
        if (userIdFromToken === req.params.id || userRoleFromToken.includes("admin")) {
            
            if(req.body.password){
                const saltRounds = 10;
                req.body.password = await bcrypt.hash(req.body.password, saltRounds);
            }
            
            const updateUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set:{
                        firstName:req.body.firstName,
                        lastName:req.body.lastName,
                        tel:req.body.tel,
                        email:req.body.email,
                        password:req.body.password,
                    }
                },
                { new: true }
            );
            
            const {password, ...rest} = updateUser._doc;
            return res.status(201).json(rest);
        } else {
            
            return res.status(403).json({ message: "You are not authorized to update this user" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};




// Brisanje usera

export const deleteUser = async (req, res) => {
    try{

        const id= req.params.id;
        const userExist = await User.findOne({_id:id});
        if(!userExist){
            return res.status(404).json({message:"User not found"});
        }

        await User.findByIdAndDelete(id);
        res.status(201).json({message:"User deleted successfully"});

    } catch (error) {
        res.status(500).json({error:"Internal Server Error" });
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









