const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
    let token 
    if( req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
        ){
        try {
            // get token from header
            // split separates bearer from token and puts into an array
            // indexed 'Bearer' string [0] token[1] gives us just the token
            token = req.headers.authorization.split(' ')[1]

            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // GET THE USER FROM THE TOKEN.  IT HAS THE USER ID in the payload.
            // -password exludes password in the return
            // now we can use req.user in any protected route
            // remember, the id was set in the function generateToken in userController
            req.user = await User.findById(decoded.id).select('-password')

            // moves onto the next middleware if any
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error ('Not authorized')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

module.exports = {protect}