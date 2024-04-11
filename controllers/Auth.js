const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//signup route handler
exports.signup = async (req, res) => {
    try{
        //
        const{name, email, password, role} = req.body;

        //check if user already exist
        const existingUser = await User.findOne({email}) ;

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exist",
            });
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: "Error in hasing Password",      
            });
        }

        const newUser = await User.create({
            name, email, password:hashedPassword, role
        }) 

        res.status(200).json({
            success: true,
            message: "User created successfully"
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error in sign up",
        })
    }
}

exports.login = async (req, res) => {
    try{
        //data fecth
        const {email, password} = req.body;

        //validation on email and password
        if(!email || !password){
            return res.status(404).json({
                success: false,
                message: "Error, Email and Password are Required",      
            });
        }
        
        //check for registered user
        let validUser = await User.findOne({email});

        //if not a valid user
        if(!validUser){
            return res.status(404).json({
                success: false,
                message: "User not Found, Please Sign up",      
            });
        }

        const payload = {
            email: validUser.email,
            id: validUser._id,
            role: validUser.role,
        }
        
        //verify password & generate a JWT token
        if(await bcrypt.compare(password, validUser.password)){
            //password matches
            let token = jwt.sign(payload, 
                                    process.env.JWT_SECRET,
                                    {
                                        expiresIn : "2h",
            });
            
            validUser = validUser.toObject();
            validUser.token = token;
            validUser.password= undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                validUser,
                message: "User Logged in successfully"
            })
            // res.status(200).json({
            //     success: true,
            //     token,
            //     validUser,
            //     message: "User Logged in successfully"
            // })

        }
        else{
            //password not match
            return res.status(403).json({
                success: false,
                message: "Incorrect Password"
            });
        }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error in Login",
        })
    }
}

