const path = require('path')

const express = require('express')
const colors = require('colors') // eye candy for terminal 
const {errorHandler} = require('./middleware/errorMiddleware') // tied to middleware folder
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

connectDB()

const app = express()

// middleware for output
app.use(express.json())
app.use(express.urlencoded({extended: false}))



// Serve frontend
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => 
        res.sendFile(
            path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    ))
} else {
    app.get('/', (req, res) => res.send('set to production'))
}


app.use(errorHandler)

// Routes
app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

app.listen(port, () => {
    console.log(`server started on port ${port}`)
})