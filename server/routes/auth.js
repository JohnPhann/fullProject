const { argon2d } = require('argon2');
const express = require('express');
const router = express.Router();
require('dotenv').config();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/User');



// @route POST api/auth/register
// @desc Register user
// @access Pubic
router.post('/register' , async(req , res) => {
    const {username , password} = req.body;
    console.log(username);
    console.log(password);

    //simple validation
    if(!username || !password)
    {
        return res.status(400).json({
        success: false,
        message: 'Missing username or Password'});
    }
    try {
        // check for existing user
        const user = await User.findOne({username});
        if(user)
        {
            return res.status(400).json({success: false, message: 'Username alredy existing'});
        }
        // All good
        const hashedPassword = await argon2.hash(password);
        const  newUser = new User({username , password: hashedPassword });
        await newUser.save();

        // Return token
        const accessToken = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET );
        res.json({success: true , message: "User susscess" , accessToken});
    } catch(err) {
            console.log(err);
    };

})

// @route POST api/auth/login
// @desc Register user
// @access Pubic
router.post('/login' , async(req , res) => {

    const {username , password } = req.body;

    //simple validation
    if(!username || !password)
    {
        return res.status(400).json({
        success: false,
        message: 'Missing username or Password'});
    };

    try {
        // check for existing user
         const user = await User.findOne({ username });
   
        if(!user)
        {
            return res.status(400).json({success: false, message: 'incorrect Username '});
        }
        // Username found
        const passwordValid = await argon2.verify(user.password , password);
        if(!passwordValid){
            return res.status(400).json({success: false, message: 'incorrect Password '});
        }



        // All good
        // Return token
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET );
        res.json({success: true , message: "User logged is  susscess" , accessToken});



    } catch(err) {
        console.log(err);
    }


})






module.exports = router;