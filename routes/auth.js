const express = require("express");
const router = express.Router();

const User = require("../models/User");

const {login, signup} = require("../controllers/Auth");

const {auth, isStudent, isAdmin} = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);


//protected route

router.get("/test", auth, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for TESTS",
    });
});

router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for student",
    });
});

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for Admin",
    });
} );


// router.get("/getEmail", auth, async (req, res) => {
//     try{
//         const id = req.user.id;
//         console.log("Id: ",id);
//         const user = await User.findById(id);

//         res.status(200).json({
//             success: true,
//             user: user,
//             message: "Welcomee to the Email route"
//         })
//     }
//     catch(error){
//         return res.status(500).json({
//             success: false,
//             user: error.message,
//             message: "Error in Email route"
//         })
//     }
// });


module.exports = router;