const mongoose = require('mongoose')

const goalSchema = mongoose.Schema({

    // user ties the person to their goals
    // later an _id will be created. ObjectId binds to that.
    // ref refers to the user model
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: [true, 'please add a text value']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Goal', goalSchema )