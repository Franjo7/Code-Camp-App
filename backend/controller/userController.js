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
            return res.status(400).json({

                error:{
                    message:"User already exist",
                    code:400
                }
            });
        }

        const saltRounds = 10;
         const hashedPassword = await bcrypt.hash(password, saltRounds);

            savedUser.password = hashedPassword;
            const newUser = await savedUser.save();

            const payload ={
                user: {
                    _id:newUser._id,
                    role:newUser.role,
                
                   
                }
            }

           const token =  jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1hr'});
            res.status(201).json({token});
        
    } catch (error) {
        console.error(`Error in registerUser controller ${error}`)
        res.status(500).json({error:"Internal Server Error" });
    }
};


// user login

export const login = async (req, res) => {
        const {email,password} = req.body;
    try{
       const user  = await User.findOne({email});

         if(!user){
            return res.status(400).json({
                error:{
                    message:"User not found",
                    code:400
                }
            });
         }
        
         const isMatch = await bcrypt.compare(password,user.password);
            
         if (!isMatch) {
            return res.status(400).json({
                error: { 
                    message: "Invalid password",
                    code: 400
                }
            });
        }

        const payload ={
            user: {
                _id:user._id,
                role:user.role,
                firstName:user.firstName
            
            }
        };

        const token =  jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1hr'});

        res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 }).status(200).json({token});
       
    } catch (error) {
        console.error(`Error in login controller ${error}`)
        res.status(500).json({error:"Internal Server Error" });
    }
};





// fetching user by id

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                error:{
                    message:"User not found",
                    code:404
                }
            });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(`error in getUser controller ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// update user

export const update = async (req, res) => {
    try {
        const userIdFromToken = req.user.user._id;
        const targetUserId = req.params.id;

        if (userIdFromToken !== targetUserId) {
            return res.status(403).json({ 
                error: { 
                    message: "You are not authorized to update other users",
                    code: 403
                } 
            });
        }

        const newPassword = req.body.password;
        const user = await User.findById(targetUserId);
        const hashedPassword = user.password;


        let passwordMatch;
        
        if(newPassword === hashedPassword){
            passwordMatch = true;
        } else{
           // passwordMatch = await bcrypt.compare(newPassword, hashedPassword);
           passwordMatch = false;
        }

            
        if (passwordMatch) {
            const updateUser = await User.findByIdAndUpdate(
                targetUserId,
                {
                    $set: {
                        firstName: req.body.firstName || user.firstName,
                        lastName: req.body.lastName || user.lastName,
                        tel: req.body.tel || user.tel,
                        email: req.body.email || user.email,
                        password: user.password,
                        role: user.role
                    }
                },
                { new: true }
            );
            
            const { password, ...rest } = updateUser._doc;
            return res.status(201).json(rest);
        } else {
            if (newPassword && newPassword.length >= 8) {
                const saltRounds = 10;
                req.body.password = await bcrypt.hash(newPassword, saltRounds);

                const updateUser = await User.findByIdAndUpdate(
                    targetUserId,
                    {
                        $set: {
                            firstName: req.body.firstName || user.firstName,
                            lastName: req.body.lastName || user.lastName,
                            tel: req.body.tel || user.tel,
                            email: req.body.email || user.email,
                            password: req.body.password,
                            role: user.role
                        }
                    },
                    { new: true }
                );
                
                const { password, ...rest } = updateUser._doc;
                return res.status(201).json(rest);
            } else {
                return res.status(400).json({ 
                    error: { 
                        message: "Password must be at least 8 characters long",
                        code: 400
                    } 
                });
            }
        }
    } catch (error) {
        console.error(`Error in update controller: ${error}`);
        return res.status(500).json({ 
            error: { 
                message: "Internal Server Error",
                code: 500
            } 
        });
    }
};




// delete user

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
            if (req.user.user._id === id) {
               
                await User.findByIdAndDelete(id);
                return res.status(200).json({ message: "User deleted successfully" });
            } else {
              
                return res.status(403).json({
                    error:{
                        message:"You are not authorized to delete this user",
                        code:403            
                    }
                });
            }
        
    } catch (error) {
        console.error(`Error in deleteUser controller: ${error}`)
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


















