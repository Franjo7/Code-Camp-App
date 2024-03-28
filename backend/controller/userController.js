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


// user login

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

        res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 }).status(200).json({token});
       
        // res.status(200).json({token});

    } catch (error) {
        res.status(500).json({error:"Internal Server Error" });
    }
};





// fetching user by id

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


// fetching all users

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ deleted: { $ne: true } });
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


// update user

export const update = async (req, res) => {    
    try {
        const userIdFromToken = req.user.user._id;
        const userRole = req.user.user.role;
        const targetUserId = req.params.id;
        
        if (userRole.includes("admin")) {
            if (req.body.password && userIdFromToken === targetUserId) {
                
                const saltRounds = 10;
                req.body.password = await bcrypt.hash(req.body.password, saltRounds);
            } else if (req.body.password) {
               
                return res.status(403).json({ message: "Admin is not authorized to update user passwords" });
            }

            const updateUser = await User.findByIdAndUpdate(
                targetUserId,
                {
                    $set:{
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        tel: req.body.tel,
                        email: req.body.email,
                        password: req.body.password, 
                        role: req.body.role 
                    }
                },
                { new: true }
            );
            
            const { password, ...rest } = updateUser._doc;
            return res.status(201).json(rest);
        } else if (userIdFromToken === targetUserId) {
           
            if(req.body.password){
                const saltRounds = 10;
                req.body.password = await bcrypt.hash(req.body.password, saltRounds);
            }
            
            const updateUser = await User.findByIdAndUpdate(
                targetUserId,
                {
                    $set:{
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        tel: req.body.tel,
                        email: req.body.email,
                        password: req.body.password,
                        role: userRole 
                    }
                },
                { new: true }
            );
            
            const { password, ...rest } = updateUser._doc;
            return res.status(201).json(rest);
        } else {
            
            return res.status(403).json({ message: "You are not authorized to update this user" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


// delete user

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userRole = req.user.user.role;
        
        
        if (userRole.includes("admin")) {
            
            await User.findByIdAndDelete(id);
            return res.status(200).json({ message: "User deleted successfully" });
        } else {
          
            if (req.user.user._id === id) {
               
                await User.findByIdAndDelete(id);
                return res.status(200).json({ message: "User deleted successfully" });
            } else {
              
                return res.status(403).json({ message: "You are not authorized to delete this user" });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


















