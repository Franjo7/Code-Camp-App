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
                    _id:newUser._id
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
                _id:user._id
            }
        };

        const token =  jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1hr'});
       
        res.status(200).json({token});

    } catch (error) {
        res.status(500).json({error:"Internal Server Error" });
    }
};





// Dohvatanje usera

export const fetch = async (req, res) => { 
    try{
        const users = await User.find();
        
        if(users.length === 0){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({error:"Internal Server Error" });
    }
};


// Azuriranje usera

export const update = async (req, res) => {
   try{

    const id = req.params.id;
    const userExist = await User.findOne({_id:id});

    if(!userExist){
        return res.status(404).json({message:"User not found"});
    }

    const updateUser = await User.findByIdAndUpdate(id,req.body,{new:true});
    res.status(201).json(updateUser);

   } catch (error) {
    res.status(500).json({error:"Internal Server Error" });
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











