const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.auth = (req, res, next) => {
    try{

        console.log("cookie", req.cookies.token);   //secure
        console.log("Body", req.body.token);    //less secure
        console.log("Header", req.header("Authorization")); // most secure

        //extract jwt token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token Missing",      
            });
        }

        //verify the token
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);

            req.user = payload;
        } catch(err){
            return res.status(401).json({
                success: false,
                message: "Token is invalid",      
            });
        }
        next();
    }
    catch(err){
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token",      
        }); 
    }
}


exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students",      
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified",      
        });
    }
}

exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for admin",      
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Admin role cannot be verified",      
        });
    }
}




