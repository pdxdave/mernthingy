const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc Register new user
// @rooute POST /api/users
// @accesss Public
const registerUser = asyncHandler (async(req, res) => {
    
    // make sure all data fields are input
    const {name, email, password} = req.body 
    if(!name || !email || !password){
        res.status(400)
        throw new Error ('please add all fields')
    }

    // does user exist
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error ('User already exists')
    }

     // hash password
    const salt = await bcrypt.genSalt(10)
        // password comes from form
    const hashedPassword = await bcrypt.hash(password, salt)

    // create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    // if user was created
    if(user){
        res.status(201).json({
            // _id is created by mongodb
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc Authenticate new user
// @rooute POST /api/users/login
// @accesss Public
const loginUser = asyncHandler (async(req, res) => {

    const {email, password} = req.body;
    // check user email
    const user = await User.findOne({email})
            // password from form. other from db
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user credentials')
    }
})


// @desc Get user
// @rooute Get /api/users/me
// @accesss Private
const getMe = asyncHandler (async(req, res) => {
    res.json({message: 'get my user shit'})

    // By default, MongoDB generates a unique ObjectID identifier that is assigned to the _id field
    // const {_id, name, email} = await User.findById(req.user.id)
    // res.status(200).json({
    //     id: _id,
    //     name,
    //     email
    // })

    // replaced the above with the below. it contains id, name, email
    res.status(200).json(req.user)

   
    
})



// generate a token
const generateToken = (id) => {
    return jwt.sign(
        {id}, 
        process.env.JWT_SECRET, 
        {expiresIn: '5d'}
)}

module.exports = {
    registerUser,
    loginUser,
    getMe
}