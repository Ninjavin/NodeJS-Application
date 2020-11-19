const express = require('express')
const bodyParser = require('body-parser')

require('dotenv').config();

const app = express()

const authRouter = require('./api/routes/auth')
const userRouter = require('./api/routes/users')
const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://ninjavin:${process.env.DB_PASSWORD}@cluster0.ikct4.mongodb.net/<dbname>?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/v1/auth', authRouter)
app.use('/v1/users', userRouter)

app.use('/', (req, res) => {
	res.status(201).json({
		"message": "Server is up and running!"
	})
})

module.exports = app