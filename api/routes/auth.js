const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

router.get('/', (req, res) => {
	User.find().exec().then(
		users => {
			res.status(200).json({
				noOfUsers: users.length,
				users: users
			})
		}
	).catch(
		err => {
			res.status(501).json({
				error: err
			})
		}
	)
})

router.post('/signup', (req, res) => {
	User.findOne({ email: req.body.email }).exec().then(
		user => {
			if(user){
				res.status(409).json({
					message: "User already signed up!"
				})
			}else{
				bcrypt.hash(req.body.password, 5, (err, hash) => {
					if(err){
						res.status(501).json({
							error: err
						})
					}else{
						const user = new User({
							_id: new mongoose.Types.ObjectId,
							email: req.body.email,
							name: req.body.name,
							password: hash
						})
						user.save().then(newUser => {
							const token = jwt.sign({ email: newUser.email }, "secret", {
								expiresIn: "1h"
							})
							res.status(201).json({
								message : "User created",
								credentials : {
									_id: newUser._id,
									email: newUser.email,
									password: newUser.password,
									name: newUser.name,
									token: token
								}
							})
						}).catch(err => {
							res.status(501).json({
								error: err
							})
						})	
					}
				})
			}
		}
	).catch(
		err => {
			res.status(501).json({
				error: err
			})
		}
	)	
})

router.post('/login', (req, res) => {
	const email = req.body.email
	User.findOne({ email: email }).exec().then(
		user => {
			if(!user){
				return res.status(409).json({
					message: "User doesn't exist"
				})
			}
			bcrypt.compare(req.body.password, user.password, (error, result) => {
				if(error){
					return res.status(401).json({
						error: error
					})
				}
				if(result){
					const token = jwt.sign({ email: user.email, id: user.id }, "secret", {
						expiresIn: "1h"
					})
					return res.status(200).json({
						message: "Logged In",
						credentials: user,
						token: token
					})
				}
				return res.status(401).json({
					message: "Password Incorrect"
				})	
			})
		}
	).catch(
		err => {
			return res.status(500).json({
				error: err
			})
		}
	)
})

router.delete('/:userId', (req, res) => {
	User.deleteOne({ _id: req.params.userId }).exec().then(
		user => {
			res.status(201).json({
				message: "User Deleted",
				credentials: user
			})
		}
	).catch(
		err => {
			res.status(500).json({
				error: err
			})
		}
	)
})

module.exports = router