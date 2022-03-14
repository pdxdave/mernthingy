const asyncHandler = require('express-async-handler') // saves from writing trycatches

const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @desc Get goals
// @route GET /api/goals
// @access Private
const getGoals = asyncHandler( async (req, res) => {

    // there's a relationship between the userModel and goalModel. this gives us access to the user
    const goals = await Goal.find({user: req.user.id})
    res.status(200).json(goals)
    
    res.status(200).json({message: 'get goals now'})
})

// @desc Set goals
// @route POST /api/goals
// @access Private
const setGoal = asyncHandler( async (req, res) => {

    if(!req.body.text){
        res.status(400)
        throw new Error('Please add some text')
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })

    res.status(200).json(goal)
})

// @desc Update goals
// @route UPDATE /api/goals/:id
// @access Private
const updateGoal = asyncHandler( async (req, res) => {

    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('That goal does not exist')
    }

    // removed and changed line 58 from user.id to req.user.id
    // const user = await User.findById(req.user.id)

    // check for user. as part of changes went from !user to !req.user
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    // goal.user is an object with id. need to turn it into a string
    if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new: true})

    res.status(200).json(updatedGoal)
})

// @desc Delete goal
// @route DELETE /api/goals/:id
// @access Private
const deleteGoal = asyncHandler( async (req, res) => {

    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('That ID does not exist')
    }

    // const user = await User.findById(req.user.id)

    // check for user. changed from !user to !req.user
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    // goal.user is an object with id. need to turn it into a string. changed, was user.id to req.user.id
    if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    await goal.remove()

    res.status(200).json({id: req.params.id})
})


module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}